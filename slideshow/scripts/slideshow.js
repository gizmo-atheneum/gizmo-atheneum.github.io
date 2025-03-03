(function(){
  
  let overlap = 1;
  
  let Track = function(config,index,players,next) {
    ['start','fadeIn','fadeOut'].forEach((p) => {
      config[p] = config[p] || 0;
    });
    config.maxVolume = config.maxVolume || 99;
    //console.log(config);
    let player = players[index % players.length];
    
    let fadeIn = (config.fadeIn > 0) ? () => {
      let interval = setTimeout(() => {
        player.volume += 0.01;
        if (player.volume < config.maxVolume / 100) {
          fadeIn();
        }
      },config.fadeIn*10);
    } : () => {
      player.volume = config.maxVolume / 100;
    };
    
    let fadeOut = (config.fadeOut > 0) ? () => {
      setTimeout(() => {
        player.volume -= 0.01;
        if (player.volume >= 0.01) {
          fadeOut();
        } else {
          player.pause();
          player.dispatchEvent(new Event('fadedOut'));
        }
      },config.fadeOut*10);
    } : () => {
      player.volume = 0.01;
      player.pause();
    };
    let runtime = config.end - config.start;
    let timeToFadeOut = 1000 * (runtime - config.fadeOut);
    let awaitFadeOut = () => {
      setTimeout(() => {
        fadeOut();
      },timeToFadeOut);
    }
    let awaitNext = (function(){
      let nextFadeInTime = next?.getFadeInTime();
      if (!isNaN(nextFadeInTime)) {
        let timeToNext = 1000 * (runtime - nextFadeInTime - overlap);
        return () => {
          setTimeout(() => {
            next.play()
          }, timeToNext);
        }
      } else {
        return () => {
          let eventHandler = () => {
            player.removeEventListener('fadedOut',eventHandler);
            let musicEndTime = (new Date()).getTime();
            ns.State.musicTime = (musicEndTime - ns.State.startTime)
            console.log(ns.State);
          }
          player.addEventListener('fadedOut',eventHandler);
        };
      }
    })();
    
    this.getFadeInTime = (() => config.fadeIn);

    this.play = () => {
      player.pause();
      console.log(index + ": " + config.src);
      player.src = "./mp3/" + config.src;
      player.volume = 0;
      player.load();
      player.play().then(() => {
        player.pause();
        player.currentTime = config.start;
        player.play().then(() => {
          fadeIn();
          awaitFadeOut();
          awaitNext();
        });
      });
    }
  }
  Track.buildTracklist = function(songs,players) {
    let songErrors = songs.filter((s) => {
      return isNaN(s.end) || ((typeof s.src) != "string");
    });
    if (songErrors.length > 0) {
      console.log(songErrors);
    } else {
      let next;
      while (songs.length > 0) {
        let song = songs.pop();
        let index = songs.length;
        next = new Track(song,index,players,next);
      }
      return next;
    }
  }
  
  let Slide = function(type,value,index,transitionTimeSec,waitTime,canvas1,canvas2,next) {
    let canvasIndex = index % 2;
    let canvases = [canvas1,canvas2];
    let canvasA = canvases[canvasIndex];
    let canvasB = canvases[1-canvasIndex];
    let clear = function() {
      canvasA.style.backgroundImage = "";
      canvasA.innerHTML = '';
    }
    let settersByType = {
      image: function() {
        canvasA.style.backgroundImage = "url('./img/" + value + "')";
      },
      text: function() {
        canvasA.innerHTML = `<span class="caption">${value}</span>`;
      },
      empty: function() {}
    }
    let transitionIn = function() {
      if (canvasA.style.opacity == 1 && canvasB.style.opacity == 0) {
        if (next) {
          next.preload();
          setTimeout(() => { next.transition(); }, waitTime);
        } else {
            let slideEndTime = (new Date()).getTime();
            ns.State.slideTime = (slideEndTime - ns.State.startTime);
            console.log(ns.State);
        }
      } else if (canvasA.style.opacity < 1 || canvasB.style.opacity > 0) {
        if (canvasA.style.opacity < 1) {
          canvasA.style.opacity = 0.01 + parseFloat(canvasA.style.opacity);
        } 
        if (canvasB.style.opacity > 0) {
          canvasB.style.opacity -= 0.01;
        }
        setTimeout(() => {
          transitionIn();
        }, transitionTimeSec * 10);
      }
    }
    this.preload = function() {
      clear();
      settersByType[type]();
    }
    this.transition = function() {
      transitionIn();
    }
  }
  Slide.buildSlideshow = function(slides,transitionTimeSec,waitTime,canvas1,canvas2,fadeLast) {
    let next;
    if (fadeLast) {
      next = new Slide("empty","",slides.length,transitionTimeSec,waitTime,canvas1,canvas2);
    }
    while (slides.length > 0) {
      let slide = slides.pop();
      let index = slides.length;
      next = new Slide(slide.type || "empty",slide.value || "",index,transitionTimeSec,waitTime,canvas1,canvas2,next);
    }
    return next;
  }
  
  let slideTime = 1961;

  let imageFadeOutSeconds = 0.4;

  let Slideshow = function(canvas1, canvas2, player1, player2) {
    let images = JSON.parse(localStorage.getItem("images"));
    let slideShowTime = (slideTime + (imageFadeOutSeconds * 1000)) * (images.length + 1);
    let firstSlide = ns.Slide.buildSlideshow(images,imageFadeOutSeconds,slideTime,canvas1,canvas2)
    let songs = JSON.parse(localStorage.getItem("songs"));
    let songTime = songs.map((s) => s.end - (s.start || 0) - (s.fadeIn || 0)).reduce((a,b) => a + b, 0);
    console.log({songTime: songTime, slideShowTime: slideShowTime});
    let firstTrack = ns.Track.buildTracklist(songs,[player1, player2]);
    if (firstTrack) {
      canvas1.style.opacity = 0;
      canvas2.style.opacity = 1;
      this.start = function() {
        ns.State.startTime = (new Date()).getTime();
        setTimeout(() => {
          firstSlide.preload();
          firstTrack.play();
          firstSlide.transition();
        }, slideTime);
      }
    }
  }
  
  let loadImages = function(galleryId) {
    let images = JSON.parse(localStorage.getItem("images")).filter((s) => {
      return s.type == "image";
    }).map((s) => s.value);
    document.getElementById(galleryId).innerHTML = images.map((img,index) => {
      return `<div class="thumb" style="background-image: url('./img/${img}')" title="${index}: ${img}"></div>`
    }).join("");
  }

  let init = function(canvas1Id,canvas2Id,player1Id,player2Id) {
    let Slideshow = importNS("Slideshow");
    let slideshow = new Slideshow(
      document.getElementById(canvas1Id),
      document.getElementById(canvas2Id),
      document.getElementById(player1Id),
      document.getElementById(player2Id));
    window.start = function(button) {
      if (button) {
        button.parentElement.removeChild(button);
        slideshow.start();
        delete window.start();
      }
    };
  }

/*
<div id="canvas1" class="d-flex justify-content-center align-items-center">
</div>
<div id="canvas2" class="d-flex justify-content-center align-items-center">
  <button class="startButton" onclick="start(this)">Press to start slideshow</button>
</div>
<div class="hidden">
  <audio id="player1"></audio>
  <audio id="player2"></audio>
</div>
*/

})();
