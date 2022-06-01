
/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const repeatBtn = $(".btn-repeat");
const randomBtn = $(".btn-random");

const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  song: [
    {
      name: "Lối Nhỏ",
      singer: "Đen,Phương Anh Đào",
      path: "./asset/music/LoiNho.mp3",
      image: "./asset/img/LoiNho.jpg",
    },
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "./asset/music/nevada.mp3",
      image: "./asset/img/nevada.jpg",
    },
    {
      name: "Mang Tiền Về Cho Mẹ",
      singer: "Đen,Nguyên Thảo",
      path: "./asset/music/MangTienVeChoMe.mp3",
      image: "./asset/img/MangTienVeChoMe.jpg",
    },
    {
      name: "We Don't Talk Anymore",
      singer: "Charlie Puth",
      path: "./asset/music/WeDon'tTalk.mp3",
      image: "./asset/img/WeDontTalk.jpg",
    },
    {
      name: "Một Triệu Like",
      singer: "Đen,Thành Đồng",
      path: "./asset/music/Mot_Trieu_Like.mp3",
      image: "./asset/img/MotTrieuLike.jpg",
    },
    {
      name: "SummerTime",
      singer: "K-391",
      path: "./asset/music/summerTime.mp3",
      image: "./asset/img/summerTime.jpg",
    },
    {
      name: "Mười Năm",
      singer: "Đen,Ngọc Linh",
      path: "./asset/music/Muoi_Nam.mp3",
      image: "./asset/img/MuoiNam.jpg",
    },
    {
      name: "Attention",
      singer: "Charlie Puth",
      path: "./asset/music/Attention.mp3",
      image: "./asset/img/Attention.jpg",
    },
    {
      name: "Trốn Tìm",
      singer: "Đen,MTV band",
      path: "./asset/music/Tron_Tim.mp3",
      image: "./asset/img/TronTim.jpg",
    },
    {
      name: "Shape Of you",
      singer: "Ed Sheeran",
      path: "./asset/music/ShapeOfYou.mp3",
      image: "./asset/img/ShapeOfYou.jpg",
    },
    {
      name: "Cho Mình Em",
      singer: "Đen,Binz",
      path: "./asset/music/ChoMinhEm.mp3",
      image: "./asset/img/ChoMinhEm.jpg",
    },
    {
      name: "Ngày Lang Thang",
      singer: "Đen",
      path: "./asset/music/NgayLangThang.mp3",
      image: "./asset/img/NgayLangThang.jpg",
    },
  ],
  render: function () {
    const htmls = this.song.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb" style="background-image: url('${
                  song.image
                }');"></div>

                <div class="body">
                    <div class="title">${song.name}</div>
                    <div class="author">${song.singer}</div>
                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 12000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scroll = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scroll;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      // Khi song play
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };

      // Khi song pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      // Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // Xử lý khi tua song
      progress.onchange = function (e) {
        const seekTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      };
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi phát lại song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Khi end song
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      // Xử lý khi click vào song
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vô song
        if (songNode && !e.target.closest(".option")) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vô option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length - 1;
    }

    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;

    if (this.currentIndex >= this.song.length) {
      this.currentIndex = 0;
    }

    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Đ/N các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe / xử lý event
    this.handleEvents();

    // Tải info song firt vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start()
