import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as math from 'mathjs';

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

  getCaretOffset() {
    return this.screen.nativeElement.selectionStart;
  }

  setCaretPosition(position: number) {
    this.screen.nativeElement.selectionStart = position+1;
    this.screen.nativeElement.selectionEnd = position+1;
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

  postOperation(operation: string) {
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
    if(operation === 'ans') {
      this.setCaretPosition(currentCaretPosition+2);
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

    result = math.evaluate(rawData);
    this.result = result;
    this.ans = result;
  }
  
  clear() {
    this.screen.nativeElement.value = "";
    this.screen.nativeElement.focus();
    this.result = null;
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
}