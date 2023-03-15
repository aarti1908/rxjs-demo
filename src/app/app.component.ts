import { Component, OnInit } from '@angular/core';
import { fromEvent, interval, of, takeUntil, timer } from 'rxjs';

interface Item { name: string; startX: number; startY: number; clicked: boolean; }
enum Status {
  NOT_STARTED ,STARTED , OVER
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'rxjsDemo';
  status: typeof Status = Status;
  gameStatus : number = Status.NOT_STARTED;
  onClickAudio = new Audio('assets/audios/pop.wav');
  onBombClickAudio = new Audio('assets/audios/game-over.mp3');
  score: number = 0;
  
  circlePosition = {
    left: 0,
    top: 0
  }

  itemPosition = {
    left: 0,
    top: 0
  }

  availableItems = ['apple', 'banana', 'watermelon', 'pear', 'grapes','bomb'];
  items : Item[] = [];
  itemInterval:any;

  ngOnInit(){
    fromEvent(document, 'mousemove').subscribe((value:any) => {
      this.circlePosition = {
        left : value.clientX ? value.clientX - 25  : 0,
        top : value.clientY ? value.clientY - 25 : 0
      }
    })
  }

  onStart(){
    this.gameStatus = Status.STARTED;
    const observer = {
      next: () => {
        {
          let randomIndex = Math.floor(Math.random() * (this.availableItems.length));
          let randomXPosition = Math.floor(Math.random() * (window.innerWidth - 150)) + 1;
          this.items.push({
            name: this.availableItems[randomIndex],
            startX: randomXPosition,
            startY : 0,
            clicked: false
          })
        }
      },
      error: () => console.error('Observer got an error: '),
      complete: () => {
        this.generateScore();
        this.itemInterval.unsubscribe();
      },
    };

    this.itemInterval = interval(1000)
    .pipe(takeUntil(timer(1000 * 60)))
    .subscribe(observer);
  }


  onItemClick(index : number){
    
    if(this.items[index].name === 'bomb') {
      this.onBombClickAudio.play();
      this.itemInterval.unsubscribe();
      this.generateScore();
    } else {
      this.onClickAudio.play();
      this.items[index].clicked = true;
    }
    
  }

  
  generateScore(){
    this.gameStatus = Status.OVER;
    let clickedItems = this.items.filter(item => item.clicked );
    this.score = clickedItems.length;
  }

  getScreenSize(){
    return {
      width : screen.width,
      height : screen.height
    }
  }
  
}
