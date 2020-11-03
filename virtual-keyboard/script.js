const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    keyboard: '',
    keysElements: [],
    audio: '',
},
  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false
  },

  inputValue: '',
  isCapsLock: false,
  isEn: true,
  ru: ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'ю', 'я'],
  en: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],


  init() {
      // Create main container
      this.elements.keyboard = document.createElement("div");

      // Set classes, add container with keys to DOM
      this.elements.keyboard.classList.add('keyboard', 'keyboard--hidden', 'keyboard__keys');
      this.elements.keyboard.appendChild(this.createKeys());
      this.elements.keysElements = this.elements.keyboard.querySelectorAll(".keyboard__key");
      document.body.appendChild(this.elements.keyboard);

      document.querySelectorAll(".use-keyboard-input").forEach(element => {
          element.addEventListener("focus", () => {
              this.open()
          });
          element.oninput = function (e) {
              element.value = e.currentTarget.value
              this.inputValue = element.value
          }
      });


      // Audio
      this.elements.audio = document.createElement('audio');
      this.elements.audio.setAttribute('src', './assets/letter.mp3');
  },

  createKeys() {
      const fragment = document.createDocumentFragment();
      const keys = [
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
          "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
          "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
          "en","z", "x", "c", "v", "b", "n", "m", ",", ".", "?","shift",
          "space","done"
      ];

      // creates HTML for an icon
      const createIconHTML = (icon_name) => {
          return `<i class="material-icons">${icon_name}</i>`;
      };

      keys.forEach((key, index) => {
          const keyElement = document.createElement("button");
          keyElement.setAttribute("type", "button");
          keyElement.classList.add("keyboard__key");


          const isLastElementInARow = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

          switch (key) {
              case "en":
                  keyElement.classList.add("keyboard__key-wide");
                  keyElement.textContent = 'en';
                  keyElement.addEventListener("click", () => {
                      this.audioOn();
                      keyElement.textContent = this.isEn ? 'ru' : 'en';
                      let index = 0;
                      for (let i = 0; i < this.elements.keysElements.length; i++) {
                          if (this.elements.keysElements[i].classList.contains('keyboard__alphabet')) {

                              let indexInKeys = keys.indexOf(this.elements.keysElements[i].textContent);
                              keys.splice(indexInKeys, 1, this.isEn ? this.ru[index] : this.en[index]);
                              if (this.properties.capsLock){
                                  this.elements.keysElements[i].textContent = this.isEn ? this.ru[index].toUpperCase() : this.en[index].toUpperCase();
                              }
                              else{
                                  this.elements.keysElements[i].textContent = this.isEn ? this.ru[index].toLowerCase()  : this.en[index].toLowerCase();
                              }

                              index++;
                          }
                      }
                      this.isEn = !this.isEn;
                  });
                  break;
              case "backspace":
                  keyElement.classList.add("keyboard__key-wide");
                  keyElement.innerHTML = createIconHTML("backspace");

                  keyElement.addEventListener("click", () => {
                      this.audioOn();
                      this.inputValue = document.querySelector(".use-keyboard-input").value;
                      this.inputValue = this.inputValue.slice(0, -1);
                      this.input();
                  });
                  break;
              case "caps":
                  keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                  keyElement.innerHTML = createIconHTML("keyboard_capslock");

                  keyElement.addEventListener("click", () => {
                      this.audioOn();
                      this._toggleCapsLock();
                      keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });
          
                    break;
              
              case "shift":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.textContent = key.toLowerCase();
      
                  keyElement.addEventListener("click", () => {
                    this.audioOn();
                    this._toggleShift();
                    keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
                  });
      
                  break;
          

              case "enter":
                  keyElement.innerHTML = createIconHTML("keyboard_return");

                  keyElement.addEventListener("click", () => {
                      this.audioOn();
                      this.inputValue = document.querySelector(".use-keyboard-input").value;
                      this.inputValue += "\n";
                      this.input();
                  });
                  break;

              case "space":
                keyElement.classList.add("keyboard__key--extra-wide");
                  keyElement.innerHTML = createIconHTML("space_bar");

                  keyElement.addEventListener("click", () => {
                      this.audioOn();
                      this.inputValue = document.querySelector(".use-keyboard-input").value
                      this.inputValue += " ";
                      this.input()
                  });
                  break;

              case "done":
                  keyElement.classList.add("keyboard__key-wide", "keyboard__key-dark");
                  keyElement.innerHTML = createIconHTML("check_circle");

                  keyElement.addEventListener("click", () => {
                      this.audioOn();
                      this.close();
                  });
                  break;

              default:
                  keyElement.textContent = key.toLowerCase();
                  keyElement.classList.add("key-token");


                  if (this.en.includes(key)) {
                      keyElement.classList.add('keyboard__alphabet')
                  }

                  keyElement.addEventListener("click", () => {
                      this.audioOn();

                      this.inputValue = document.querySelector(".use-keyboard-input").value
                      this.inputValue += this.properties.capsLock ? keys[index].toUpperCase() : keys[index].toLowerCase();
                      this.input();
                  });
                  break;
          }
          fragment.appendChild(keyElement);
          if (isLastElementInARow) fragment.appendChild(document.createElement("br"));
      });

      return fragment;
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keysElements) {
      if (key.childElementCount === 0 && key.classList.contains("key-token")) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    const keyLayoutAlt = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
    this.properties.shift = !this.properties.shift;
    for (const key of this.elements.keysElements) {
      if (key.childElementCount === 0 && key.classList.contains("key-token")) {
        if (!isNaN(+key.textContent) || keyLayoutAlt.findIndex(x=> x==key.textContent)>=0) {
          key.textContent = this.properties.shift ? keyLayoutAlt[+key.textContent] : "" + keyLayoutAlt.findIndex(x=> x==key.textContent);
        } else {
          key.textContent = this.properties.shift!=this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    }
  },

  input() {
      document.querySelectorAll(".use-keyboard-input").forEach(element => {
          element.value = this.inputValue
      })
  },
  open() {
      this.elements.keyboard.classList.remove("keyboard--hidden");
  },
  close() {
      this.elements.keyboard.classList.add("keyboard--hidden");
  },
  audioOn() {
      this.elements.audio.play()
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  keysBacklightOn();
});


function keysBacklightOn() {
  document.addEventListener('keyup', function (event) {


      let keys = document.querySelectorAll('.keyboard__key')


      for(let value of keys){

          if(value.textContent===event.key){
              value.style.backgroundColor='red';
              setTimeout(()=>{
                  value.removeAttribute('style')
              },250)
          }

      }

      // if (keys.includes(event.key)) {
      //
      //
      //
      //
      // }
  });

}
