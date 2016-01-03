var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('object-assign');

// Внутренний объект для хранения шаблонов
var _templates = {
  'blocks':[]
};

// Метод для загрузки шаблонов из данных Действия
function loadTemplates(data) {
  _templates = data;
}
function addTemplate(data) {
  _templates.blocks.push(data);
}

// Добавить возможности Event Emitter из Node
var TemplateStore = objectAssign(EventEmitter.prototype, {

  // Вернуть все шаблоны
  getTemplates: function() {
    return _templates;
  },

  emitChange: function() {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});

// Зарегистрировать обработчик в Диспетчере
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;
  // Обработать Действие в зависимости от его типа
  switch(action.actionType) {
    case 'ADD_COMPONENT':
      // Вызвать внутренний метод на основании полученного Действия
      // loadTemplates(action.data);
      addTemplate(action.data);
      break;

    default:
      return true;
  }
  console.log("store",action.data);
  // Если Действие было обработано, создать событие "change"
  TemplateStore.emitChange();

  return true;

});

module.exports = TemplateStore;