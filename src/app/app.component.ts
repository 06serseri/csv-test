import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { FinancialReportRow } from './financialReportRow';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'polatAlemdar';
  csvRecords: any;
  header: boolean = true;
  financialReportsList: FinancialReportRow[] = [];
  boldRowsCodes = ['499500', '799800', '799900', '979900', '999700'];
  notBlank = true;
  showFrame = false;
  showAdjustmentColumn = true;
  //isBold = false;

  financialReportObject = new FinancialReportRow(
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    false
  );
  mymodel: any;

  constructor(private ngxCsvParser: NgxCsvParser) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header =
      (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser
      .parse(files[0], {
        header: this.header,
        delimiter: ',',
        encoding: 'utf8',
      })
      .pipe()
      .subscribe({
        next: (result): void => {
          console.log('RESULT', result);
          this.csvRecords = result;
          console.log(this.csvRecords);
          var i;
          // for (i = 0; i < this.csvRecords.length; i++) {
          for (i = 0; i < this.csvRecords.length; i++) {
            this.financialReportObject = {
              glCode: '',
              glName: '',
              periodToDateAmount: 0,
              periodToDatePercentage: 0,
              yearToDateAmount: 0,
              yearToDatePercentage: 0,
              adjustingJE: 0,
              yearToDateAmountAndAdjustingJERoundedToZeroDecimal: 0,
              roundingAdjustmentOneDollar: 0,
              finalAmount: 0,
              isBold: false,
            };
            // console.log('i IS: ' + i);

            // console.log(
            //   'CURRENT ROW IS: ' + this.csvRecords[i].glCode,
            //   this.csvRecords[i].glName,
            //   +this.csvRecords[i].periodToDateAmount,
            //   +this.csvRecords[i].periodToDatePercentage,
            //   +this.csvRecords[i].yearToDateAmount,
            //   +this.csvRecords[i].yearToDatePercentage
            // );

            if (this.csvRecords[i].glCode != '') {
              //ASSIGN CSV ROW VALUES TO THE DUMMY OBJECT

              this.financialReportObject.glCode = this.csvRecords[i].glCode;

              this.financialReportObject.glName = this.csvRecords[i].glName;
              this.financialReportObject.periodToDateAmount = Number(
                this.csvRecords[i].periodToDateAmount
              );
              this.financialReportObject.periodToDatePercentage =
                Number(this.csvRecords[i].periodToDatePercentage) / 100;
              this.financialReportObject.yearToDateAmount = Number(
                this.csvRecords[i].yearToDateAmount
              );
              this.financialReportObject.yearToDatePercentage =
                Number(this.csvRecords[i].yearToDatePercentage) / 100;
              this.financialReportObject.adjustingJE = 0; //GET INPUT FROM THE USER
              this.financialReportObject.yearToDateAmountAndAdjustingJERoundedToZeroDecimal =
                Math.trunc(
                  this.financialReportObject.yearToDateAmount +
                    this.financialReportObject.adjustingJE
                );
              this.financialReportObject.roundingAdjustmentOneDollar = 0; //GET INPUT FROM THE USER
              this.financialReportObject.finalAmount =
                this.financialReportObject
                  .yearToDateAmountAndAdjustingJERoundedToZeroDecimal +
                this.financialReportObject.roundingAdjustmentOneDollar;
              if (
                this.boldRowsCodes.includes(this.financialReportObject.glCode)
              ) {
                this.financialReportObject.isBold = true;
                //console.log('ISBOLD IS: ' + this.financialReportObject.isBold);
              } else {
                this.financialReportObject.isBold = false;
                //console.log('ISBOLD IS: ' + this.financialReportObject.isBold);
              }
              // this.notBlank = true;
              //console.log('NOTBLANK IS: ' + this.notBlank);
              this.financialReportsList.push(this.financialReportObject);
            } else {
              // this.notBlank = false;
              this.financialReportObject.glCode = '';
              this.financialReportObject.glName = '';
              this.financialReportObject.periodToDateAmount = '';
              this.financialReportObject.periodToDatePercentage = '';
              this.financialReportObject.yearToDateAmount = '';
              this.financialReportObject.yearToDatePercentage = '';
              this.financialReportObject.adjustingJE = ''; //GET INPUT FROM THE USER
              this.financialReportObject.yearToDateAmountAndAdjustingJERoundedToZeroDecimal =
                '';
              this.financialReportObject.roundingAdjustmentOneDollar = ''; //GET INPUT FROM THE USER
              this.financialReportObject.finalAmount = '';
              //console.log('NOTBLANK IS: ' + this.notBlank);
            }

            // console.log(
            //   'OBJECT IS: ' + JSON.stringify(this.financialReportObject)
            // );

            // console.log(
            //   'CURRENT ARRAY ITEM IS: ' +
            //     JSON.stringify(this.financialReportsList[i])
            // );
          }
        },
        error: (error: NgxCSVParserError): void => {
          console.log('ERR', error);
        },
      });
  }

  journalEntryAdjustment(newValue: any, i: number): void {
    const mymodel = newValue;
    console.log('NEW VALUE IS: ' + newValue);
    this.financialReportsList[i].adjustingJE = newValue;
    this.financialReportsList[
      i
    ].yearToDateAmountAndAdjustingJERoundedToZeroDecimal =
      Number(this.financialReportsList[i].yearToDateAmount) +
      Number(this.financialReportsList[i].adjustingJE);
    this.financialReportsList[i].finalAmount =
      Number(
        this.financialReportsList[i]
          .yearToDateAmountAndAdjustingJERoundedToZeroDecimal
      ) + Number(this.financialReportsList[i].roundingAdjustmentOneDollar);

    //this.financialReportsList[i].adjustingJE;
    console.log('i IS: ' + i);
    console.log('OBJECT IS: ' + JSON.stringify(this.financialReportsList[i]));
  }

  oneDollarRounding(newValue: any, i: number): void {
    const mymodel = newValue;
    console.log('NEW VALUE IS: ' + newValue);
    this.financialReportsList[i].roundingAdjustmentOneDollar = newValue;
    this.financialReportsList[i].finalAmount =
      Number(
        this.financialReportsList[i]
          .yearToDateAmountAndAdjustingJERoundedToZeroDecimal
      ) + Number(this.financialReportsList[i].roundingAdjustmentOneDollar);
    //this.financialReportsList[i].adjustingJE;
    console.log('i IS: ' + i);
    console.log('OBJECT IS: ' + JSON.stringify(this.financialReportsList[i]));
  }

  isBoldRow(glCode: string) {
    if (this.boldRowsCodes.includes(glCode)) {
      return true;
    }
    return false;
  }

  onSubmit() {
    console.log(this.financialReportsList);
  }

  makePdf() {
    this.showAdjustmentColumn = false;
    this.showFrame = true;

    let title = 'Super Tuna Report';

    setTimeout(() => {
      let mywindow = window.open(
        '',
        'PRINT',
        'height=800,width=1200,top=100,left=150'
      )!;

      mywindow.document.write(`<html><head><title>${title}</title>`);
      mywindow.document.write('</head><body>');
      mywindow.document.write(document.getElementById('printMeOut')!.innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close();
      mywindow.focus();

      mywindow.print();
      mywindow.close();
    }, 100);
  }
}
