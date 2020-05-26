import { Component, ViewChild } from '@angular/core';
import {  ModalController, AlertController } from '@ionic/angular';
import { AddWeightComponent } from '../add-weight/add-weight.component';
import {Storage} from '@ionic/storage'

import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('chart', {static: true}) chart: any;

  public chartVar

  public dados
  public dadosFront
  public dadosFormatados
  public carregou = false

  constructor(
    private modalCtrl: ModalController, 
    private storage: Storage,
    private alertCtrl: AlertController
  ) {
    
  }

  async ngOnInit() {
    const dadosDoBanco = await this.storage.get('dados')
    if(!dadosDoBanco) {
      const dadosParaOBanco = [
        { data: new Date(2020, 2, 16).toISOString(), peso: 93.0 },
        { data: new Date(2020, 2, 17).toISOString(), peso: 92.5 },
        { data: new Date(2020, 2, 18).toISOString(), peso: 91.9 },
        { data: new Date(2020, 2, 19).toISOString(), peso: 90.4 },
        { data: new Date(2020, 2, 21).toISOString(), peso: 89.3 },
        { data: new Date(2020, 2, 23).toISOString(), peso: 88.9 },
        { data: new Date(2020, 2, 26).toISOString(), peso: 88.4 },
        { data: new Date(2020, 2, 27).toISOString(), peso: 88.22 },
        { data: new Date(2020, 2, 28).toISOString(), peso: 87.5 },
        { data: new Date(2020, 3, 4).toISOString(), peso: 86.5 },
        { data: new Date(2020, 3, 6).toISOString(), peso: 86.3 },
        { data: new Date(2020, 3, 7).toISOString(), peso: 85.9 },
        { data: new Date(2020, 3, 8).toISOString(), peso: 85.6 },
        { data: new Date(2020, 3, 10).toISOString(), peso: 84.9 },
        { data: new Date(2020, 3, 16).toISOString(), peso: 84.2 },
        { data: new Date(2020, 3, 17).toISOString(), peso: 83.9 },
        { data: new Date(2020, 3, 18).toISOString(), peso: 83.7 },
        { data: new Date(2020, 3, 19).toISOString(), peso: 83.6 },
        { data: new Date(2020, 3, 21).toISOString(), peso: 83.2 },
        { data: new Date(2020, 3, 24).toISOString(), peso: 82.5 },
        { data: new Date(2020, 3, 26).toISOString(), peso: 82.3 },
        { data: new Date(2020, 3, 27).toISOString(), peso: 82.0 },
        { data: new Date(2020, 3, 28).toISOString(), peso: 81.9 },
        { data: new Date(2020, 3, 30).toISOString(), peso: 81.7 },
        { data: new Date(2020, 4, 2).toISOString(), peso: 81.3 },
        { data: new Date(2020, 4, 5).toISOString(), peso: 81.2 },
        { data: new Date(2020, 4, 6).toISOString(), peso: 80.7 },
        { data: new Date(2020, 4, 7).toISOString(), peso: 80.0 },
        { data: new Date(2020, 4, 9).toISOString(), peso: 79.6 },
      ]

      await this.storage.set('dados', dadosParaOBanco)
      this.dados = dadosParaOBanco
      this.dadosFront = this.dados.slice().reverse()

    } else {
      this.dados = dadosDoBanco
      this.dadosFront = this.dados.slice().reverse()

    }
    
     this.mostrarChart()
    
    this.carregou = true
  }


  mostrarChart() {
    let timeFormat = 'MM/DD/YYYY HH:mm'
    this.dadosFormatados = this.dados.map(dado => {
      return  { x: new Date(dado.data), y:dado.peso}
    })
    const label = this.dados.map(dado => {
      return new Date(dado.data)
      
    })
    const peso = this.dados.map(dado => {
      return dado.peso
    })
    console.log(label.length, peso.length)
    this.chartVar = new Chart(this.chart.nativeElement, {
      type: 'line',
      data: {
        labels: [...label],
        datasets: [{
          label: 'Peso em Kg',
          data: [...peso],
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
					xAxes: [{
						type: 'time',
						time: {
              unit: 'day',
              displayFormats: {
                day: 'DD/MM',
              }
						},
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
				},
      }
      
    });

  }

  async addWeight() {
    const modal = await  this.modalCtrl.create({
      component: AddWeightComponent,
      cssClass: 'modal-small'
    })
    await modal.present()
    const dadosRegistro = await modal.onDidDismiss()

    if(!dadosRegistro.data) {
      console.log("cancelado")
    } else {
      let dadosRegistrados = await this.storage.get('dados')
      if(dadosRegistrados) {
        dadosRegistrados.push({data: dadosRegistro.data.data, peso: dadosRegistro.data.peso})
        await this.storage.set('dados', dadosRegistrados )
        
        this.dados.push({data: dadosRegistro.data.data, peso: dadosRegistro.data.peso})
        this.dadosFront = this.dados.slice().reverse()
        this.mostrarChart()
      }
    }
  }

  async abrirAlertaDeletar(index) {
    const alerta = await this.alertCtrl.create({
      message: 'Deletar pesagem ?',
      buttons: [
        {
          text: 'Cancelar',
          handler: async () => {
            await alerta.dismiss()
          }
        },
        {
          text: "Deletar",
          handler: async () => {
            await this.deletarDado(index)
            await alerta.dismiss()
          }
        }
      ]
    })
    await alerta.present()
  }

  async deletarDado(index) {
    const  dadosTemporarios = this.dados.slice().reverse()
    const dadosCorretos = dadosTemporarios.filter((dado, indexDado) => {
      if(index !== indexDado) {
        return dado
      }
    })
    console.log(dadosCorretos)
    this.dados = dadosCorretos.slice().reverse()
    await this.storage.set('dados', this.dados)
    this.dadosFront = dadosCorretos
    this.mostrarChart()
  }
}
