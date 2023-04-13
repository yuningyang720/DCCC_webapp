import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  @Input() title: string;
  @Input() src: string;
  private curser = 0;
  private duration = 10;
  @Input() player = new Audio();
  playerReady = false;

  constructor() { }

  ngOnInit() {
    this.player.src = this.src;
    this.player.preload = 'metadata';
    this.player.load();
    this.player.onloadedmetadata = () => {
      this.duration = this.player.duration;
      this.playerReady = true;
    };
    this.curser = 0;
    this.player.ontimeupdate = () => {
      this.curser = this.player.currentTime;
    }
  }

  private getLastSeg(url: string) {
    return url.substring(url.lastIndexOf('/') + 1)
  }

  play() {
    if (this.getLastSeg(this.player.src) !== this.getLastSeg(this.src)) {
      this.player.src = this.src;
    }
    if (this.player.paused) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  isPlaying() {
    return !this.player.paused;
  }

  seekAudio(value) {
    this.player.currentTime = value;
  }
}
