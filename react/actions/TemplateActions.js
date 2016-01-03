var AppDispatcher = require('../dispatcher/AppDispatcher');


var TemplateActions = {

  loadTemplates: function(data) {
    AppDispatcher.handleAction({
      actionType: "ADD_COMPONENT",
      data: data
    })
  }

};

global.TemplateActions = TemplateActions;
module.exports = TemplateActions;