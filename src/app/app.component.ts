import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  balloonCount = 0; // 0 to 29 indicates balloons 1 to 30
  showInterlude = false;
  interludeIndex = 0; // 1 to 30
  interludeSubIndex = 0; // 0 or 1
  showCake = false;
  showVideo = false;
  isBursting = false;

  currentBgColor = 'var(--bg-white)';
  currentBalloonColor = 'var(--color-sky-blue)';
  clusterColors: string[] = [];

  candlesLit = [true, true, true, true];
  candlesSwaying = false;
  cakeMessage = 'Make a wish!';

  interludeMessages: string[] = [
    "Year: [1995]  Status: Born  Evidence: Missing",
    // "First photo I saw of you!",
    "This was your diet at that age, right?",
    // "Second time we met!",
    "I found your toys",
    "Somewhere far away, I was born",
    // "Third time you met me… plot twist: we got married 😌",
    "Finally recovered your footage 😌.Probably made you too cute.",
    "You became brother for the second time!",
    "Found your first writing book!, were you this late to writing?",
    "And third!...",
    "You probably got books to read!",
    "Lovely post cards sent to your parents!",
    "What felt like most difficult language to learn, you mastered it!",
    "You got a favourite hobby!",
    "And another one!",
    "Got one of this?",
    "You probably won a trophy or two by now!",
    "Learning the basics",
    "Did you do this then?",
    ...Array.from({ length: 54 }, (_, i) => `Message for photo ${i + 7}`)
  ];

  get currentPhotoIndex(): number {
    return this.interludeIndex;
  }

  currentPhotoUrl = '';
  currentExtensionIndex = 0;
  extensions = ['png', 'jpg', 'jpeg', 'jfif', 'webp', 'gif'];

  audioExtensions = ['m4a', 'mp3', 'm3a'];
  currentAudioExtensionIndex = 0;

  photoAudio = new Audio();
  isAudioPlaying = false;

  get hasAudio() {
    return this.currentPhotoIndex === 17 || this.currentPhotoIndex === 1;
  }

  updatePhotoUrl() {
    this.currentPhotoUrl = `assets/photo-${this.currentPhotoIndex}.${this.extensions[this.currentExtensionIndex]}`;

    if (this.hasAudio) {
      this.currentAudioExtensionIndex = 0;
      this.playPhotoAudio();
    }
  }

  playPhotoAudio() {
    this.photoAudio.src = `assets/audio-${this.currentPhotoIndex}.${this.audioExtensions[this.currentAudioExtensionIndex]}`;
    
    this.photoAudio.onerror = () => {
      if (this.currentAudioExtensionIndex < this.audioExtensions.length - 1) {
        this.currentAudioExtensionIndex++;
        this.playPhotoAudio();
      } else {
        console.warn('Audio file not found in any supported format');
        this.isAudioPlaying = false;
      }
    };

    this.photoAudio.play().then(() => {
      this.isAudioPlaying = true;
    }).catch(e => {
      // Browsers may block auto-play, promise will reject. 
      console.warn('Audio play denied or failed', e);
      this.isAudioPlaying = false;
    });

    this.photoAudio.onended = () => {
      this.isAudioPlaying = false;
    };
  }

  stopPhotoAudio() {
    this.photoAudio.pause();
    this.photoAudio.currentTime = 0;
    this.isAudioPlaying = false;
  }

  toggleAudio(event: Event) {
    event.stopPropagation();
    if (this.isAudioPlaying) {
      this.photoAudio.pause();
      this.isAudioPlaying = false;
    } else {
      this.photoAudio.play().then(() => {
        this.isAudioPlaying = true;
      }).catch(e => console.warn(e));
    }
  }

  onPhotoError(event: Event) {
    if (this.currentExtensionIndex < this.extensions.length - 1) {
      this.currentExtensionIndex++;
      this.updatePhotoUrl();
    } else {
      const target = event.target as HTMLImageElement;
      target.alt = `(Photo not found: photo-${this.currentPhotoIndex}.[png|jpg|jpeg|jfif...])`;
    }
  }

  randomColors = [
    'var(--color-sky-blue)', 'var(--color-green)', 'var(--color-orange)',
    'var(--color-pink)', 'var(--color-purple)', 'var(--color-yellow)', 'var(--color-coral)'
  ];
  randomBgs = ['var(--bg-white)', 'var(--bg-black)', '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f'];

  ngOnInit() {
    this.updateColors();
  }

  popBalloon() {
    if (this.isBursting) return;
    this.playPopSound();

    this.isBursting = true;

    setTimeout(() => {
      this.isBursting = false;
      this.balloonCount++;

      this.interludeIndex = this.balloonCount;
      this.interludeSubIndex = 0;
      this.currentExtensionIndex = 0;
      this.updatePhotoUrl();
      this.showInterlude = true;
    }, 400); // 400ms burst animation
  }

  nextAfterInterlude() {
    this.showInterlude = false;

    if (this.balloonCount >= 30) {
      this.startCakeStage();
    } else {
      this.updateColors();
    }
  }

  get balloonsToRender() {
    return this.balloonCount === 4 ? [0, 1, 2, 3, 4] : [0];
  }

  getBalloonTransform(index: number) {
    if (this.balloonCount === 4) {
      const rotations = [-25, -12, 0, 12, 25];
      return `rotate(${rotations[index]}deg)`;
    }
    return 'none';
  }

  getBalloonColor(index: number) {
    if (this.balloonCount === 4 && this.clusterColors.length > index) {
      return this.clusterColors[index];
    }
    return this.currentBalloonColor;
  }

  updateColors() {
    if (this.balloonCount === 0) {
      this.currentBgColor = 'var(--bg-white)';
      this.currentBalloonColor = 'var(--color-sky-blue)';
    } else if (this.balloonCount === 1) {
      this.currentBgColor = 'var(--bg-white)';
      this.currentBalloonColor = 'var(--color-green)';
    } else if (this.balloonCount === 2) {
      this.currentBgColor = 'var(--bg-white)';
      this.currentBalloonColor = 'var(--color-orange)';
    } else if (this.balloonCount === 3) {
      this.currentBgColor = 'var(--bg-black)';
      this.currentBalloonColor = 'var(--color-pink)';
    } else {
      // Randomness
      const randBgIdx = Math.floor(Math.random() * this.randomBgs.length);
      const randColIdx = Math.floor(Math.random() * this.randomColors.length);
      this.currentBgColor = this.randomBgs[randBgIdx];
      this.currentBalloonColor = this.randomColors[randColIdx];
    }

    if (this.balloonCount === 4) {
      this.clusterColors = Array.from({ length: 5 }, () => 
        this.randomColors[Math.floor(Math.random() * this.randomColors.length)]
      );
    }
  }

  startCakeStage() {
    this.showCake = true;
    this.currentBgColor = 'var(--bg-black)';

    // Start swaying after 5 seconds
    setTimeout(() => {
      this.candlesSwaying = true;
      this.cakeMessage = 'Blow out the candles!';
    }, 5000);
  }

  blowCandle(index: number) {
    if (this.candlesLit[index]) {
      this.candlesLit[index] = false;
      this.checkAllCandlesOff();
    }
  }

  checkAllCandlesOff() {
    if (this.candlesLit.every(lit => !lit)) {
      setTimeout(() => {
        this.showCake = false;
        this.showVideo = true;
      }, 1500); // Wait 1.5s after last candle goes out
    }
  }

  playPopSound() {
    try {
      const audio = new Audio('assets/burstballoon.mp3');
      audio.play();
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
}
