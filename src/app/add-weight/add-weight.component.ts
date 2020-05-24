import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-weight',
  templateUrl: './add-weight.component.html',
  styleUrls: ['./add-weight.component.scss'],
})
export class AddWeightComponent implements OnInit {
  data: Date = new Date()
  dataCustomizada
  peso

  constructor(private modalCtrl: ModalController) {
    this.dataCustomizada = {
      buttons:[{
        text: "Cancelar",
      }, {
        text: "Confirmar",
        handler: ({day, month, year}) => {
          this.data = new Date(year.value, month.value - 1, day.value)
          console.log(this.data.toISOString())
          return true
        }
      }]
    }
  }

  ngOnInit() {}

  async registrarPeso() {
    await this.modalCtrl.dismiss({data: this.data, peso: this.peso})
  }

  async dismiss() {
      await this.modalCtrl.dismiss()
  }
}
