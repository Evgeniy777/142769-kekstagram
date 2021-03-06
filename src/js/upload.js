/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';
module.exports = function() {
  (function() {
    /** @enum {string} */
    var FileType = {
      'GIF': '',
      'JPEG': '',
      'PNG': '',
      'SVG+XML': ''
    };

    /** @enum {number} */
    var Action = {
      ERROR: 0,
      UPLOADING: 1,
      CUSTOM: 2
    };

    /**
     * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
     * из ключей FileType.
     * @type {RegExp}
     */
    var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

    /**
     * @type {Object.<string, string>}
     */
    var filterMap;

    /**
     * Объект, который занимается кадрированием изображения.
     * @type {Resizer}
     */
    var currentResizer;

    /**
     * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
     * изображением.
     */
    var cleanupResizer = function() {
      if (currentResizer) {
        currentResizer.remove();
        currentResizer = null;
      }
    };

    /**
     * Ставит одну из трех случайных картинок на фон формы загрузки.
     */
    var updateBackground = function() {
      var images = [
        'img/logo-background-1.jpg',
        'img/logo-background-2.jpg',
        'img/logo-background-3.jpg'
      ];

      var backgroundElement = document.querySelector('.upload');
      var randomImageNumber = Math.round(Math.random() * (images.length - 1));
      backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
    };

    /**
     * Проверяет, валидны ли данные, в форме кадрирования.
     * @return {boolean}
     */
    var inputs = document.querySelector('#upload-resize').getElementsByClassName('upload-resize-control');
    var inputsLength = inputs.length;
    var inputX = document.querySelector('#resize-x');
    var inputY = document.querySelector('#resize-y');
    var inputSize = document.querySelector('#resize-size');
    var sendButton = document.querySelector('#resize-fwd');
    inputX.value = 0;
    inputY.value = 0;
    inputSize.value = 0;
    var resizeFormIsValid = function() {
      if(((parseInt(inputX.value, 10) + parseInt(inputSize.value, 10)) < currentResizer._image.naturalWidth) &&
        ((parseInt(inputY.value, 10) + parseInt(inputSize.value, 10)) < currentResizer._image.naturalHeight) &&
        ((parseInt(inputX.value, 10) >= 0)) &&
        ((parseInt(inputY.value, 10) >= 0))) {
        return true;
      } else {
        return false;
      }
    };
    var addHandlers = function() {
      for(var i = 0; i < inputsLength; i++) {
        inputs[i].addEventListener('input', function() {
          if(resizeFormIsValid()) {
            sendButton.removeAttribute('disabled');
          } else {
            sendButton.setAttribute('disabled', 'disabled');
          }
        });
      }
    };
    addHandlers();
    /**
     * Форма загрузки изображения.
     * @type {HTMLFormElement}
     */
    var uploadForm = document.forms['upload-select-image'];

    /**
     * Форма кадрирования изображения.
     * @type {HTMLFormElement}
     */
    var resizeForm = document.forms['upload-resize'];

    /**
     * Форма добавления фильтра.
     * @type {HTMLFormElement}
     */
    var filterForm = document.forms['upload-filter'];

    /**
     * @type {HTMLImageElement}
     */
    var filterImage = filterForm.querySelector('.filter-image-preview');

    /**
     * @type {HTMLElement}
     */
    var uploadMessage = document.querySelector('.upload-message');

    /**
     * @param {Action} action
     * @param {string=} message
     * @return {Element}
     */
    var showMessage = function(action, message) {
      var isError = false;

      switch (action) {
        case Action.UPLOADING:
          message = message || 'Кексограмим&hellip;';
          break;

        case Action.ERROR:
          isError = true;
          message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
          break;
      }

      uploadMessage.querySelector('.upload-message-container').innerHTML = message;
      uploadMessage.classList.remove('invisible');
      uploadMessage.classList.toggle('upload-message-error', isError);
      return uploadMessage;
    };

    var hideMessage = function() {
      uploadMessage.classList.add('invisible');
    };

    /**
     * Обработчик изменения изображения в форме загрузки. Если загруженный
     * файл является изображением, считывается исходник картинки, создается
     * Resizer с загруженной картинкой, добавляется в форму кадрирования
     * и показывается форма кадрирования.
     * @param {Event} evt
     */
    uploadForm.addEventListener('change', function(evt) {
      var element = evt.target;
      if (element.id === 'upload-file') {
        // Проверка типа загружаемого файла, тип должен быть изображением
        // одного из форматов: JPEG, PNG, GIF или SVG.
        if (fileRegExp.test(element.files[0].type)) {
          var fileReader = new FileReader();

          showMessage(Action.UPLOADING);

          fileReader.addEventListener('load', function() {
            cleanupResizer();

            currentResizer = new Resizer(fileReader.result);
            currentResizer.setElement(resizeForm);
            uploadMessage.classList.add('invisible');

            uploadForm.classList.add('invisible');
            resizeForm.classList.remove('invisible');

            hideMessage();
          });

          fileReader.readAsDataURL(element.files[0]);
        } else {
          // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
          showMessage(Action.ERROR);
        }
      }
    });

    /**
     * Обработка сброса формы кадрирования. Возвращает в начальное состояние
     * и обновляет фон.
     * @param {Event} evt
     */
    resizeForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();

      resizeForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    /**
     * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
     * кропнутое изображение в форму добавления фильтра и показывает ее.
     * @param {Event} evt
     */
    resizeForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      if (resizeFormIsValid()) {
        var image = currentResizer.exportImage().src;

        var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
        for (var i = 0; i < thumbnails.length; i++) {
          thumbnails[i].style.backgroundImage = 'url(' + image + ')';
        }

        filterImage.src = image;

        resizeForm.classList.add('invisible');
        filterForm.classList.remove('invisible');
      }
    });

    /**
     * Сброс формы фильтра. Показывает форму кадрирования.
     * @param {Event} evt
     */
    filterForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      filterForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });

    /**
     * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
     * записав сохраненный фильтр в cookie.
     * @param {Event} evt
     */
    var uploadFilterForm = document.getElementById('upload-filter');
    filterForm.addEventListener('submit', function(evt) {
      evt.preventDefault();
      cleanupResizer();
      updateBackground();
      function getLastSelectedFilter() {
        return uploadFilterForm.querySelector('input[name="upload-filter"]:checked').getAttribute('value');
      }
      function setLocalStorage() {
        localStorage.setItem('upload-filter', getLastSelectedFilter());
      }
      setLocalStorage();
      filterForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });
    function restoredFromLocalStorage() {
      var stored = localStorage.getItem('upload-filter');
      if(stored && stored.length > 0) {
        uploadFilterForm.querySelector('input:checked').removeAttribute('checked');
        var uploadedFilter = uploadFilterForm.querySelector('input[value=' + stored + ']');
        uploadedFilter.setAttribute('checked', 'checked');
        filterImage.className = 'filter-image-preview filter-' + stored;
      }
    }
    restoredFromLocalStorage();
    /**
     * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
     * выбранному значению в форме.
     */
    filterForm.addEventListener('change', function() {
      if (!filterMap) {
        // Ленивая инициализация. Объект не создается до тех пор, пока
        // не понадобится прочитать его в первый раз, а после этого запоминается
        // навсегда.
        filterMap = {
          'none': 'filter-none',
          'chrome': 'filter-chrome',
          'sepia': 'filter-sepia',
          'marvin': 'filter-marvin'
        };
      }
      var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
        return item.checked;
      })[0].value;
      // Класс перезаписывается, а не обновляется через classList потому что нужно
      // убрать предыдущий примененный класс. Для этого нужно или запоминать его
      // состояние или просто перезаписывать.
      filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    });
    window.addEventListener('resizerchange', function() {
      inputX.value = currentResizer.getConstraint().x;
      inputY.value = currentResizer.getConstraint().y;
      inputSize.value = currentResizer.getConstraint().side;
    });
    var changeResizeValue = function() {
      inputX.addEventListener('input', function() {
        currentResizer.moveConstraint(inputX.value - currentResizer.getConstraint().x, 0, 0);
      });
      inputY.addEventListener('input', function() {
        currentResizer.moveConstraint(0, inputY.value - currentResizer.getConstraint().y, 0);
      });
      inputSize.addEventListener('input', function() {
        currentResizer.moveConstraint(0, 0, inputSize.value - currentResizer.getConstraint().side);
      });
    };
    changeResizeValue();
    cleanupResizer();
    updateBackground();
  })();
};
