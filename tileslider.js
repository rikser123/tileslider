(function(window){



    function TileSlider(options) {

        function extend( a, b ) {
            for( var key in b ) {
                if( b.hasOwnProperty( key ) ) {
                    a[key] = b[key];
                }
            }
            return a;
        }


        this.options = extend( {}, this.options );
        extend( this.options, options );

        this.items = this.options.elem.querySelectorAll('.tile-item');
        this.itemsLength = this.items.length;
        this.current = 0;
        this.active = 1;
        this.isAnimated = false;
        this._createTiles();
        this._initEvents();
    }


    TileSlider.prototype.options = {
        tileX : 5,
        tileY: 5,
        elem: document.querySelector('.banner-slide-container'),
        randomize: true,
        transitionSpeed: 250,
        autoPlay: false,
        autoPlayTime: 3000,
        tilesDelay: 100,
        nextItemAppearTime: 1000,
        nextItemTransitionTime: 2500,
        rewind: true,
        bannerNavigation: true,
        dotsNav: true
    }



    TileSlider.prototype._createTiles = function() {

        if (this.options.dotsNav) {
            var dotsContainer = document.createElement('div');
            dotsContainer.className = 'dots-container';
            this.options.elem.appendChild(dotsContainer);
            [].forEach.call(this.items, function(item, index){
                var dot = document.createElement('div');
                dot.className = 'dots-container_dot';
                dot.setAttribute('data-index', index);
                dotsContainer.appendChild(dot);
            });

            dotsContainer.children[0].classList.add('active');
        }

        if (this.options.bannerNavigation) {
            var bannerNavigation = document.createElement('div');
            bannerNavigation.className = 'banner-navigation';
            this.options.elem.appendChild(bannerNavigation);
            bannerNavigation.insertAdjacentHTML('afterBegin', ' <div class="banner-left-arrow"></div><div class="banner-right-arrow"></div>' );
        }

        [].forEach.call(this.items, function(item){
            item.style.transitionDuration = this.options.nextItemTransitionTime + 'ms';
        }.bind(this));

        var totalTiles = this.options.tileX * this.options.tileY;
        var tileItems = [].slice.call(this.options.elem.querySelectorAll('.tile-item'));
        var tileWidth = tileItems[0].clientWidth / this.options.tileX;
        var tileHeight = tileItems[0].clientHeight / this.options.tileY;
        var self = this;
        tileItems[0].classList.add('active');


        tileItems.forEach(function(item){

            var tilesLineNumber = self.options.tileY;
            for (var i = 0; i < tilesLineNumber; i++) {
                var line = document.createElement('div');
                line.className = 'line-tile';
                item.appendChild(line);
            }

            for (var i = 0; i < totalTiles; i++) {
                var tile = document.createElement('div');
                tile.className = 'tile';
                item.appendChild(tile);
                tile.style.width = tileWidth + 'px';
                tile.style.height = tileHeight + 'px';
            }
        });



        tileItems.forEach(function(item) {
            [].forEach.call(item.querySelectorAll('.tile'), function (tile, index) {
                tile.setAttribute('data-index', index + 1);
                var indexAttr = tile.getAttribute('data-index');
                if (indexAttr % self.options.tileX === 0) {
                    tile.setAttribute('data-finished-tile', 'true')
                }
            });

            var tiles = [].slice.call(item.querySelectorAll('.tile'));
            var lines = [].slice.call(item.querySelectorAll('.line-tile'));

            var k = 0;
            while (k < lines.length) {
                for (var j = 0; j < tiles.length; j++) {
                    lines[k].appendChild(tiles[j]);
                    if (tiles[j].getAttribute('data-finished-tile')) {
                        k++;
                    }

                }
            }


            lines.forEach(function(line, index){
                [].forEach.call(line.querySelectorAll('.tile'), function(tile, index){
                    tile.style.left = tile.offsetWidth * index + 'px';
                });

                line.style.top = tileHeight * index + 'px';
            });

            var imgs = item.querySelector('.img-wrap');

            tiles.forEach(function(tile){
                tile.style.backgroundImage = 'url('+imgs.src+')';
                var left = -parseInt(tile.style.left);
                var top = -parseInt(tile.parentNode.style.top);
                tile.style.backgroundPosition = ''+(left)+'px '+(top)+'px';
            })
        });

        [].forEach.call(this.items, function(item){
            item.querySelector('img').hidden = true;
        })
    };

    TileSlider.prototype._randomizeEffect = function() {
        var numberTiles = [];
        var itemTiles = this.items[this.current].querySelectorAll('.tile');
        var self = this;
        var min = 0;
        var max = itemTiles.length - 1;

        function createRandomNumber(min, max) {
            return Math.floor(min + Math.random() * (max + 1 - min));
        }


        var j = 0;
        while (j < itemTiles.length)  {
            var number = createRandomNumber(0, itemTiles.length - 1);
            if (numberTiles.indexOf(number) === -1) {
                numberTiles.push(number);
            } else {
                j--;
            }
            j++;
        }


        [].forEach.call(itemTiles, function(tile){
            tile.style.transitionDuration = ''+self.options.transitionSpeed+'ms';
            tile.style.transitionProperty = 'all';
        });

        var k = 0;
        var timer = setInterval(function(){
            var index = numberTiles[k];
            itemTiles[index].classList.add('scaled');
            k++;
            if (k=== numberTiles.length) clearInterval(timer)
        },self.options.tilesDelay)

    };


    TileSlider.prototype._slideImage = function(direction) {


        var current = this.current;
        var next = null;
        var self = this;



        if (this.isAnimated) {
            return;
        }

        if (direction === 'left') {
            next = current - 1;
        } else {
            next = current + 1;
        }


        if (!this.options.rewind) {

            if (next < 0) {
                next = 0;
                return;
            }


            if (next > this.itemsLength - 1) {
                next = this.itemsLength - 1;
                return;
            }
        } else {
            if (next < 0) {
                next = this.itemsLength - 1;
            }

            if (next > this.itemsLength - 1) {
                next = 0;
            }
        }




        var index = 0;
        var tiles = this.items[current].querySelectorAll('.tile');


        if (!this.options.randomize) {
            var timer = setInterval(function(){
                tiles[index].classList.add('scaled');
                index++;
                if (index=== tiles.length) clearInterval(timer);
            },self.options.tilesDelay);
        } else {
            this._randomizeEffect();
        }



        setTimeout(function(){
            self.items[current].classList.remove('active');
            self.items[next].classList.add('active');
            [].forEach.call(self.options.elem.querySelectorAll('.dots-container_dot'), function(dot){
                dot.classList.remove('active');
            });
        },this.options.nextItemAppearTime);


        var time = this.options.tilesDelay * tiles.length;

        setTimeout(function(){
            [].forEach.call(tiles, function(tile){
                tile.classList.remove('scaled');
            });
            self.options.elem.querySelectorAll('.dots-container_dot')[next].classList.add('active');
            self.current = next;
            self.isAnimated = false;
        },time)


    };


    TileSlider.prototype._slideDot = function(dotIndex) {

        var current = this.current;
        var next = dotIndex;
        var self = this;



        if (this.isAnimated) {
            return;
        }



        var index = 0;
        var tiles = this.items[current].querySelectorAll('.tile');


        if (!this.options.randomize) {
            var timer = setInterval(function(){
                tiles[index].classList.add('scaled');
                index++;
                if (index=== tiles.length) clearInterval(timer);
            },self.options.tilesDelay);
        } else {
            this._randomizeEffect();
        }



        setTimeout(function(){
            self.items[current].classList.remove('active');
            self.items[next].classList.add('active');
            [].forEach.call(self.options.elem.querySelectorAll('.dots-container_dot'), function(dot){
                dot.classList.remove('active');
            });
        },this.options.nextItemAppearTime);


        var time = this.options.tilesDelay * tiles.length;

        setTimeout(function(){
            [].forEach.call(tiles, function(tile){
                tile.classList.remove('scaled');
            });
            self.options.elem.querySelectorAll('.dots-container_dot')[next].classList.add('active');
            self.current = next;
            self.isAnimated = false;
        },time)
    };


    TileSlider.prototype._initEvents = function() {
        var navigationArrows = document.querySelector('.banner-navigation').children;
        var self = this;
        if (this.options.bannerNavigation) {
            navigationArrows[0].addEventListener('click', function () {
                self._slideImage('left');
            });
            navigationArrows[1].addEventListener('click', function () {
                self._slideImage('right');
            });
        }

        if (this.options.dotsNav) {
            [].forEach.call(this.options.elem.querySelectorAll('.dots-container_dot'), function(dot){
                dot.onclick = function() {
                    self._slideDot(parseInt(dot.getAttribute('data-index')))
                }
            })
        }


        if (this.options.autoPlay) {
            setInterval(function(){
                this._slideImage('right')
            }.bind(this),this.options.autoPlayTime)
        }
    };

    window.TileSlider = TileSlider;

}(window));


/*

new TileSlider({
    tileX : 5,
    tileY: 5,
    elem: document.querySelector('.banner-slide-container'),
    randomize: true,
    transitionSpeed: 250,
    autoPlay: false,
    autoPlayTime: 3000,
    tilesDelay: 100,
    nextItemAppearTime: 1000,
    nextItemTransitionTime: 2500,
    rewind: true,
    bannerNavigation: true,
    dotsNav: true

}); */