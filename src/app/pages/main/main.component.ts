import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {create, all} from 'mathjs';
import { ArrayType } from '@angular/compiler';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  @ViewChild("screen") screen!: ElementRef;
  @ViewChild("resultBox") resultBox!: ElementRef;
  result: number | null = null;
  ans: number = 0;
  version: number = 1;
  angle: "deg" | "rad" | "grad"  = "deg";
  math: any;

  constructor() {
    this.math = create(all);
    console.log('Math: ', this.math);
    this.boostrap();
  }
  getCaretOffset() {
    return this.screen.nativeElement.selectionStart;
  }

  setCaretPosition(position: number) {
    this.screen.nativeElement.selectionStart = position+1;
    this.screen.nativeElement.selectionEnd = position+1;
  }

  changeAngleUnit() {

  }

  postNumber(number: number) {
    const currentCaretPosition: number = this.getCaretOffset();
    if (this.screen.nativeElement.selectionStart || this.screen.nativeElement.selectionStart === '0') {
      var startPos = this.screen.nativeElement.selectionStart;
      var endPos = this.screen.nativeElement.selectionEnd;
      this.screen.nativeElement.value = this.screen.nativeElement.value.substring(0, startPos)
          + number
          + this.screen.nativeElement.value.substring(endPos, this.screen.nativeElement.value.length);
    } else {
        this.screen.nativeElement.value += number;
    }
    this.screen.nativeElement.value = this.screen.nativeElement.value.replaceAll("\n", "");
    this.screen.nativeElement.value = this.screen.nativeElement.value.replaceAll(" ", "");
    this.setCaretPosition(currentCaretPosition);
    this.screen.nativeElement.focus()
  }

  postOperation(operation: string, length?: number) {
    const currentCaretPosition: number = this.getCaretOffset();
    if (this.screen.nativeElement.selectionStart || this.screen.nativeElement.selectionStart === '0') {
      var startPos = this.screen.nativeElement.selectionStart;
      var endPos = this.screen.nativeElement.selectionEnd;
      this.screen.nativeElement.value = this.screen.nativeElement.value.substring(0, startPos)
          + operation
          + this.screen.nativeElement.value.substring(endPos, this.screen.nativeElement.value.length);
    } else {
        this.screen.nativeElement.value += operation;
    }
    this.screen.nativeElement.value = this.screen.nativeElement.value.replaceAll("\n", "");
    this.screen.nativeElement.value = this.screen.nativeElement.value.replaceAll(" ", "");
    if(length) {
      this.setCaretPosition(currentCaretPosition+length);
    }else{
      this.setCaretPosition(currentCaretPosition);
    }
    this.screen.nativeElement.focus()
  }

  backspace() {
    const currentPosition: number = this.getCaretOffset();
    const rawData: string = this.screen.nativeElement.value.substr(0, currentPosition - 1) + this.screen.nativeElement.value.substr(currentPosition, this.screen.nativeElement.value.length);
    this.screen.nativeElement.value = rawData;
    this.setCaretPosition(currentPosition-2);
    this.screen.nativeElement.focus();
    
  }
  
  calculate() {
    let result: number = 0;
    const rawData = this.screen.nativeElement.value.replaceAll('×', '*').replaceAll('÷','/').replaceAll('ans', this.ans);

    result = this.math.evaluate(rawData);
    this.result = result;
    this.ans = result;
  }
  
  clear() {
    this.screen.nativeElement.value = "";
    this.screen.nativeElement.focus();
    this.result = null;
  }

  changeAngle() {
    const changeObject: any = {
      deg: "rad",
      rad: "grad",
      grad: "deg"
    }
    this.angle = changeObject[this.angle];
    this.boostrap();
  }

  showNative() {
    console.log('>>> ', this.screen);
    console.log('@> ', this.screen.nativeElement.selectionStart);
  }

  getVersion() {
    this.result = this.version;
    // console.log('Versión: ', this.version);
  }

  refresh() {
    window.location.reload();
  }

  boostrap() {
    let replacements: any = {}
    const fns1 = ['sin', 'cos', 'tan', 'sec', 'cot', 'csc']
    fns1.forEach((name: string) => {
      const fn = this.math[name as keyof typeof this.math] // the original function  
      const fnNumber = (x: any) => {
        console.log('>>> ', this.angle);
        switch (this.angle) {
          case 'deg':
            return fn(x / 360 * 2 * Math.PI)
          case 'grad':
            return fn(x / 400 * 2 * Math.PI)
          default:
            return fn(x)
        }
      }
      // create a typed-function which check the input types
      replacements[name] = this.math.typed(name, {
        'number': fnNumber
      })
    })
    this.math.import(replacements, {override: true})
  }
}