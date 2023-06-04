import { Component,OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

interface Option {
  value: string;
  href: string;
}


var count = 0;
var resu = "LOSE";

@Component({
  selector: 'app-emociones-basicas',
  templateUrl: './emociones-basicas.component.html',
  styleUrls: ['./emociones-basicas.component.css']
})
export class EmocionesBasicasComponent implements OnInit{
  options: Option[] = [
    { value: 'happy', href: 'assets/img/alegre.png' },
    { value: 'angry', href: 'assets/img/enfadado.png' },
    { value: 'surprised', href: 'assets/img/sorprendido.png' },
    { value: 'sad', href: 'assets/img/triste.png' },
  ];
  droppedItem: Option = this.options[0];
  //emocionArrastrada: string = '';

  ngOnInit() {
    getEmotion();
  }

  drop(event: CdkDragDrop<Option[]>) {
    count++;
    if (count >= 5) {

      postTest(resu);
    }
    this.droppedItem = event.item.data;
    console.log('Imagen arrastrada a la zona dropeable:', this.droppedItem.value);
    console.log(emotionTest)
    event.container.element.nativeElement.appendChild(event.item.element.nativeElement);


    if (this.droppedItem.value == emotionTest) {
      console.log("Correcto");
      resu = "WIN";
      let dropzone = document.querySelector('.dropzone')!;
      let draggedImage = document.querySelector('#draggedImage') as HTMLImageElement;
      let emotionText = document.querySelector('#emocion')! as HTMLElement;

      //Seteamos las propiedades de la imagen arrastrada para que coincidan con el item dropeado
      draggedImage.src = this.droppedItem.href;
      draggedImage.alt = this.droppedItem.value;
      // Ocultamos el texto 
      emotionText.style.display = "none";

      draggedImage.style.display = "block";
      draggedImage.style.position = "static";
      draggedImage.style.margin = "auto";
      document.body.style.backgroundColor = "green";

      //Seteamos la imagen para que relle el dropzone
      
      draggedImage.style.width = dropzone.clientWidth + "px";
      draggedImage.style.height = dropzone.clientHeight + "px";

      
      setTimeout(() => { }, 1500);
      postTest(resu);
    }else {
      let dropzone = document.querySelector('.dropzone')!;

      console.log("Incorrecto");
      resu = "LOSE";
      dropzone.classList.add('incorrect');
      setTimeout(() => {
        dropzone.classList.remove('incorrect');
      }, 1000);
    }
  

    if (event.previousContainer === event.container) {
      return;
    }
    if (this.droppedItem) {

      return;

    }

    this.droppedItem = event.item.data;
    event.container.element.nativeElement.appendChild(event.item.element.nativeElement);

    if (!event.isPointerOverContainer) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }



  }
}



var emotionId = "";
var emotionTest = "";

async function getEmotion() {
  var nuevoH1 = document.createElement('h1');
  var res = await fetch('http://127.0.0.1:8080/api/emotions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  var respuesta = await res.json();

  switch (respuesta.dataName) {
    case 'happy':
      nuevoH1.innerHTML = `Feliz`;
      break;
    case 'angry':
      nuevoH1.innerHTML = `Enfadado`;
      break;
    case 'surprised':
      nuevoH1.innerHTML = `Sorprendido`;
      break;
    case 'sad':
      nuevoH1.innerHTML = `Triste`;
      break;
    case 'neutral':
      nuevoH1.innerHTML = "Normal";
      break;
    default:
      break;
  }

  nuevoH1.id = 'testEmocion';
  nuevoH1.setAttribute('value', respuesta.dataName);

  var dropzone = document.getElementById('emocion')!;
  dropzone.innerHTML = ` Arrastra el que esté: ${nuevoH1.outerHTML}`;

  emotionId = respuesta.dataId;
  emotionTest = respuesta.dataName;
  console.log(respuesta.dataId);
}


async function postTest(resu: string) {
  var res = await fetch('http://127.0.0.1:8080/api/tests',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: "637b48e17e5e4cf71672c91b",
        tipo: "PICTO",
        intentos: count,
        emotion: emotionId,
        resultado: resu

      })
    })
  console.log(res);
  window.location.reload();
};