import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';


import { ViewChild } from '@angular/core'


import * as faceapi from 'face-api.js';

declare var navigator: any;

@Component({
  selector: 'app-reconocimiento-emociones',
  templateUrl: './reconocimiento-emociones.component.html',
  styleUrls: ['./reconocimiento-emociones.component.css']
})




export class ReconocimientoEmocionesComponent implements AfterViewInit,OnInit {
  

  WIDTH = 440;
  HEIGHT = 280;
  @ViewChild('video', { static: true })
  public video: ElementRef;
  @ViewChild('canvas', { static: true })
  public canvasRef: ElementRef;
  constructor(private elRef: ElementRef, private router: Router) { }
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  overlayDiv: HTMLElement;
  mensajeDiv: HTMLElement;
  

  
  async ngAfterViewInit() { 
    await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),]).then(() => this.startVideo());
    getEmotion();
    
  }


  ngOnInit(){
    
  
  

      console.log('vamos a ver si exiten los botones');
      const botonIntento = document.querySelector('#boton-intento');
      
      if (botonIntento) {
    
    
        botonIntento.addEventListener('click', async () => {
          var original = document!.getElementById('testEmocion')?.innerHTML;
    
          count++;
          console.log(count);
          var resu = "LOSE";
          if (count <= 5) {
            const video = document.querySelector('video')!;
    
            const canvas = faceapi.createCanvasFromMedia(video);
            const displaySize = { width: video.width, height: video.height };
    
            faceapi.matchDimensions(canvas, displaySize);
            const detections = await faceapi.detectAllFaces(video, new
              faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    
            result = await getExpression(detections) as String;
            console.log(result + 'y lo que tienes que sacar es: ' + testEmocion);
            console.log('intento numero: ' + count);
    
            if (result == testEmocion) {
              
              const overlayDiv = document.getElementById('overlay');
              overlayDiv!.style.backgroundColor = '#7FEC65';
              
              // Cambiar el título a "HAS ACERTADO!" durante 1 segundo
              const tituloEmocion = document.getElementById('testEmocion');
              
    
              tituloEmocion!.innerHTML = "HAS ACERTADO!";
              setTimeout(() => {
                tituloEmocion!.innerHTML = original!;
                //tituloEmocion?.setAttribute('value',emotionId);
                //tituloEmocion?.setAttribute('id','testEmocion');
    
                // Restaurar el título original
              }, 3000);
              
              resu = "WIN"
              console.log('Acertado!');
              console.log(emotionId);
              return postTest(resu);
              
    
            } else if (count < 5) {
    
              const overlayDiv = document.getElementById('overlay');
              overlayDiv!.style.backgroundColor = '#EC7D65';
              
              
              const tituloEmocion = document.getElementById('testEmocion');
              tituloEmocion!.innerHTML = "Vamos a intentarlo de nuevo! <br> Te quedan " + (5 - count) + " intentos";
              setTimeout(() => {
                
                tituloEmocion!.innerHTML = original!  ;
              }, 3000);
              setTimeout(() => {
                overlayDiv!.style.backgroundColor = 'white';
              }, 2000);
                      
              console.log('fallaste');
    
              
             
    
            } else if (count >= 5) {
    
              console.log('Demasiados intentos');
              console.log(emotionId);
              console.log(resu);
              return postTest(resu);
            }
          }
        });
      } else {
        console.log('no hay boton');
      }
    
  }


  startVideo() {
    this.videoInput = this.video.nativeElement;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    navigator.getUserMedia(
      { video: {}, audio: false },
      (stream: any) => (this.videoInput.srcObject = stream),
      (err: any) => console.log(err)
    );
    this.detect_Faces();
  }

  async detect_Faces() {
    this.elRef.nativeElement.querySelector('video').addEventListener('play', async () => {
      this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);
      this.canvasEl = this.canvasRef.nativeElement;
      this.canvasEl.appendChild(this.canvas);
      this.canvas.setAttribute('id', 'canvass');
      this.canvas.setAttribute(
        'style',
        `position: absolute;
        top: 0;
        left: 0;`
      );
      this.displaySize = {
        width: this.videoInput.width,
        height: this.videoInput.height
      };
      faceapi.matchDimensions(this.canvas, this.displaySize);
      setInterval(async () => {
        this.detection = await faceapi.detectAllFaces(this.videoInput, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        this.resizedDetections = faceapi.resizeResults(this.detection, this.displaySize);
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Ocultamos graficamente la deteccion facial
        //faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
        //faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
        //faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);
      }, 100);
    });
  }
}

var count = 0;




var testEmocion = "";
var result: String = "";
const video = document.getElementById('video') as HTMLVideoElement;
var result: String = "";







function getExpression(detections: any[]): string {
  const array: [string, number][] = [];

  for (const [key, value] of Object.entries(detections[0].expressions)) {
    array.push([key, value as number]);
  }

  let res: [string, number] = array[0];

  for (let i = 0; i < array.length; i++) {
    if (Math.abs(1 - res[1]) > Math.abs(1 - array[i][1])) {
      res = array[i];
    }
  }

  return res[0];
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
        tipo: "RECONGNIZE",
        intentos: count,
        emotion: emotionId,
        resultado: resu

      })
    })
  console.log(res);
  location.reload();
};

var emotionId = "";


async function getEmotion() { //Requerimos de una emocion para poner en el titulo
  var nuevoH1 = document.createElement('h1');
  var arrFra = ['Vamos a poner cara de:', 'Intentamos ponernos:', 'Ahora cara de:']


  var res = await fetch('http://127.0.0.1:8080/api/emotions',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },

    }
  );


  var respuesta = await res.json();
  //var emotionId = "";


  switch (respuesta.dataName) {       //Traducimos la emocion a español
    case 'happy':
      nuevoH1.innerHTML = `${arrFra[parseInt((Math.random() * (2 - 0)).toString())]} Feliz`;
      break;
    case 'angry':
      nuevoH1.innerHTML = `${arrFra[parseInt((Math.random() * (2 - 0)).toString())]} Enfadado`;
      break;
    case 'surprised':
      nuevoH1.innerHTML = `${arrFra[parseInt((Math.random() * (2 - 0)).toString())]} Sorprendido`;
      break;
    case 'sad':
      nuevoH1.innerHTML = `${arrFra[parseInt((Math.random() * (2 - 0)).toString())]} Triste`;
      break;
    case 'neutral':
      nuevoH1.innerHTML = "Normal" + arrFra[Math.random() * (2 - 0) + 0];
      break;
    default:
      break;
  }

  respuesta.dataName;
  nuevoH1.id = 'testEmocion';
  nuevoH1.setAttribute('value', respuesta.data);
  document.querySelector('#emocion2')!.appendChild(nuevoH1);
  testEmocion = respuesta.dataName;
  console.log(testEmocion);

  emotionId = respuesta.dataId;
  console.log(respuesta.dataId);

}



