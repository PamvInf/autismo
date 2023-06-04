import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartTypeRegistry, LinearScale, Title, Tooltip,registerables  } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  constructor() { }
  test: any;

  ngOnInit(): void {
    this.getData();
    console.log("Ejecuta get data");
  }

  async getData(): Promise<void> {
    console.log('Entra en get data');
    const id = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('x-token')!;

    const headers: Record<string, string> = { 'x-token': token };

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/tests`);
      const data = await response.json();

      const aciertosPorDia: Record<string, number> = {};
      const erroresPorDia: Record<string, number> = {};
      const aciertosPorHora: Record<number, number> = {};
      const aciertosPorEmocion: Record<string, number> = {
        '638485d2414bad1e215027cf': 0,
        '638485c8414bad1e215027cd': 0,
        '638485db414bad1e215027d3': 0,
        '638485e0414bad1e215027d5': 0
      };
      const erroresPorEmocion: Record<string, number> = {
        '638485d2414bad1e215027cf': 0,
        '638485c8414bad1e215027cd': 0,
        '638485db414bad1e215027d3': 0,
        '638485e0414bad1e215027d5': 0
      };
      const aciertosPorTest: Record<string, number> = { RECOGNIZE: 0, PHOTO: 0, PICTO: 0 };

      console.log(data);
      data.forEach((test: any) => {
        const date = new Date(test.date);
        const day = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const hour = date.getHours();
        if (test.resultado === 'WIN') {
          if (test.tipo in aciertosPorTest) {
            aciertosPorTest[test.tipo]++;
          }
          if (day in aciertosPorDia) {
            aciertosPorDia[day]++;
          } else {
            aciertosPorDia[day] = 1;
          }
          if (hour in aciertosPorHora) {
            aciertosPorHora[hour]++;
          } else {
            aciertosPorHora[hour] = 1;
          }
          if (test.emotion in aciertosPorEmocion) {
            aciertosPorEmocion[test.emotion]++;
          }
        } else {
          if (day in erroresPorDia) {
            erroresPorDia[day]++;
          } else {
            erroresPorDia[day] = 1;
          }
          if (test.emotion in erroresPorEmocion) {
            erroresPorEmocion[test.emotion]++;
          }
        }
      });

      this.createAciertosPorTestChart(aciertosPorTest);
      this.createAciertosErroresChart(aciertosPorDia, erroresPorDia);
      this.createHorasAciertosChart(aciertosPorHora);
      this.createEmocionesAciertosFallosChart(aciertosPorEmocion, erroresPorEmocion);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  createAciertosErroresChart(aciertosPorDia: Record<string, number>, erroresPorDia: Record<string, number>): void {
    const labels = Object.keys(aciertosPorDia);
    const aciertosData = Object.values(aciertosPorDia);
    const erroresData = Object.values(erroresPorDia);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Aciertos',
          data: aciertosData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Errores',
          data: erroresData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    const ctx = document.getElementById('aciertosErroresChart') as HTMLCanvasElement;
    new Chart<'bar', number[], string>(ctx, {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: `Aciertos y errores por día`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Día'
            }
          }
        }
      }
    });

     
  }

  createHorasAciertosChart(aciertosPorHora: Record<number, number>): void {
    const hours = Object.keys(aciertosPorHora);
    const hoursAMPM = hours.map(hour => {
      if (hour == '0') {
        return '12 AM';
      } else if (Number(hour) < 12) {
        return `${hour} AM`;
      } else if (hour == '12') {
        return '12 PM';
      } else {
        return `${Number(hour) - 12} PM`;
      }
    });
    const data = Object.values(aciertosPorHora);

    const chartData = {
      labels: hoursAMPM,
      datasets: [
        {
          label: 'Aciertos',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };

    const ctx = document.getElementById('horasAciertosChart') as HTMLCanvasElement;
    
    const config: ChartConfiguration<'bar'> ={
      type: 'bar',
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Horas con mayor tasa de aciertos'
          }
        },
        scales: {
          yAxes: 
            {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              title: {
                display: true,
                text: 'Cantidad'
              },
              reverse: false
            }
          ,
          xAxes: 
            {
              title: {
                display: true,
                text: 'Hora'
              }
            }
          
        }
      }
    };
    new Chart(ctx,  config);
   
  }

  createAciertosPorTestChart(aciertosPorTest: Record<string, number>): void {
    const labels = Object.keys(aciertosPorTest);
    const data = Object.values(aciertosPorTest);

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    const ctx = document.getElementById('aciertosPorTestChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: `Aciertos por tipo de test`
          }
        }
      }
    });
  }

  createEmocionesAciertosFallosChart(
    aciertosPorEmocion: Record<string, number>,
    erroresPorEmocion: Record<string, number>
  ): void {
    const emociones = ['638485d2414bad1e215027cf', '638485c8414bad1e215027cd', '638485db414bad1e215027d3', '638485e0414bad1e215027d5'];
    const emocionesId = new Map();
    emocionesId.set('feliz', '638485d2414bad1e215027cf');
    emocionesId.set('triste', '638485c8414bad1e215027cd');
    emocionesId.set('enfadado', '638485db414bad1e215027d3');
    emocionesId.set('sorprendido', '638485e0414bad1e215027d5');
    const emocionesName = ['feliz', 'triste', 'enfadado', 'sorprendido'];

    const aciertos = emociones.map(emocion => aciertosPorEmocion[emocion] || 0);
    const errores = emociones.map(emocion => erroresPorEmocion[emocion] || 0);
  
    // Ordenar las emociones en función de los aciertos
    emociones.sort((a, b) => aciertosPorEmocion[b] - aciertosPorEmocion[a]);
  
    const chartData = {
      labels: emocionesName,
      datasets: [
        {
          label: 'Aciertos',
          data: aciertos,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Errores',
          data: errores,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
      ]
    };
  
    const maxAciertos = Math.max(...aciertos);
    const maxErrores = Math.max(...errores);
  
    const ctx = document.getElementById('emociones-chart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Aciertos y errores por emoción'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(maxAciertos, maxErrores),
            title: {
              display: true,
              text: 'Número de aciertos y errores'
            }
          }
        }
      }
    });
  }
  
}

