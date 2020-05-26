import { Component, ViewChild } from '@angular/core'
import { ModalController, AlertController } from '@ionic/angular'
import { AddWeightComponent } from '../add-weight/add-weight.component'
import { Storage } from '@ionic/storage'

import { Chart } from 'chart.js'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('chart', { static: true }) chart: any

  public chartVar

  public dados
  public dadosFront
  public dadosFormatados
  public carregou = false

  constructor(private modalCtrl: ModalController, private storage: Storage, private alertCtrl: AlertController) {}

  async ngOnInit() {
    const dadosDoBanco = await this.storage.get('dados')
    if (!dadosDoBanco) this.dados = []
    else this.dados = dadosDoBanco
    this.dadosFront = this.dados.slice().reverse()

    this.mostrarChart()

    this.carregou = true
  }

  mostrarChart() {
    this.dadosFormatados = this.dados.map((dado) => {
      return { x: new Date(dado.data), y: dado.peso }
    })
    const label = this.dados.map((dado) => {
      return new Date(dado.data)
    })
    const peso = this.dados.map((dado) => {
      return dado.peso
    })
    this.chartVar = new Chart(this.chart.nativeElement, {
      type: 'line',
      data: {
        labels: [...label],
        datasets: [
          {
            label: 'Peso em Kg',
            data: [...peso],
            borderColor: 'rgb(38, 194, 129)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'DD/MM',
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'Date',
              },
            },
          ],
        },
      },
    })
  }

  async addWeight() {
    const modal = await this.modalCtrl.create({
      component: AddWeightComponent,
      cssClass: 'modal-small',
    })
    await modal.present()
    const dadosRegistro = await modal.onDidDismiss()

    if (!dadosRegistro.data) {
    } else {
      let dadosRegistrados = await this.storage.get('dados')
      if (dadosRegistrados) {
        dadosRegistrados.push({ data: dadosRegistro.data.data, peso: dadosRegistro.data.peso })
      } else {
        dadosRegistrados = [{ data: dadosRegistro.data.data, peso: dadosRegistro.data.peso }]
      }

      await this.storage.set('dados', dadosRegistrados)

      this.dados.push({ data: dadosRegistro.data.data, peso: dadosRegistro.data.peso })
      this.dadosFront = this.dados.slice().reverse()
      this.mostrarChart()
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
          },
        },
        {
          text: 'Deletar',
          handler: async () => {
            await this.deletarDado(index)
            await alerta.dismiss()
          },
        },
      ],
    })
    await alerta.present()
  }

  async deletarDado(index) {
    const dadosTemporarios = this.dados.slice().reverse()
    const dadosCorretos = dadosTemporarios.filter((dado, indexDado) => {
      if (index !== indexDado) {
        return dado
      }
    })
    this.dados = dadosCorretos.slice().reverse()
    await this.storage.set('dados', this.dados)
    this.dadosFront = dadosCorretos
    this.mostrarChart()
  }
}
