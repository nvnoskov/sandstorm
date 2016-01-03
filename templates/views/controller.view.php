<?
namespace frontend\controllers;

use \common\models\_MODEL_;


class _MODEL_Controller extends \yii\web\Controller
{

    function actionIndex()
    {
        $query = _MODEL_::find()->where(['status' => 1, 'type' => 1])->orderBy('created_at DESC, id DESC');
        $count = $query->count();
        $pagination = new \yii\data\Pagination(['totalCount' => $count,'pagesize'=>10]);
        $models = $query->offset($pagination->offset)
            ->limit($pagination->limit)
            ->all();

            return $this->render('index', ['models' => $models,'pagination'=>$pagination]);
    }

    function actionShow($id)
    {
        $model = _MODEL_::findOne($id);
        if ($model) {
            return $this->render('show', compact('model'));
        } else {
            throw new \yii\web\NotFoundHttpException();
        }
    }
}

?>