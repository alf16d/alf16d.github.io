var game = new Phaser.Game(660, 395, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update:update});

var width = 30;
var height = 16;
var width_pix = 22;
var height_pix = 22;
var mine_count = 99;
var map_number;
var map_lock;
var first_click = false;
var sprite1 = new Array();
var dt = 43;
var text1, text2;
var count_click = 0;
var count_mine = mine_count;
var textstyle = {  font: '50px digital',  fill: '#FF0000'};
var end_game = false;
var win = false;

function onbutclick1(){
    var ttt = false;

    if(width != document.getElementById("t1").value || height != document.getElementById("t2").value)
        ttt = true;

    width = document.getElementById("t1").value;
    height = document.getElementById("t2").value;
    mine_count = document.getElementById("t3").value;


    sprite1 = new Array();
    for(i = 0; i < height; i++){
        var stemp = new Array();
        for(j = 0; j < width; j++){
            var temp = game.add.sprite(j*width_pix, i*height_pix+dt, 'new');
            temp.frame = 9;
            temp.inputEnabled = true;
            temp.events.onInputDown.add(onClick, this);
            stemp.push(temp);
        }
        sprite1.push(stemp);
    }


    game.scale.setGameSize(width*width_pix, height*height_pix + dt);

    first_click = false;
    end_game = false;
    count_mine = mine_count;
    win = false;

    map_number = new Array(height);
    map_lock = new Array(height);
    for(i = 0; i < height; i++){
        map_number[i] = new Array(width);
        map_lock[i] = new Array(width);
        for(j = 0; j < width; j++){
            map_number[i][j] = 0;
            map_lock[i][j] = 0;
        }
    }
}

function preload(){
    game.load.spritesheet("new", "images/full.png", 22, 22);
    game.load.spritesheet("digit", "images/digit_numb.png", 30, 43);
}

function create(){

    map_number = new Array(height);
    map_lock = new Array(height);
    for(i = 0; i < height; i++){
        map_number[i] = new Array(width);
        map_lock[i] = new Array(width);
        for(j = 0; j < width; j++){
            map_number[i][j] = 0;
            map_lock[i][j] = 0;
        }
    }

    text1 = game.add.text(5, -7, "s: 0", textstyle);
    text2 = game.add.text(200, -7, "m: " + count_mine, textstyle);

    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    game.input.mouse.capture = true;
    for(i = 0; i < height; i++){
        var stemp = new Array();

        for(j = 0; j < width; j++){
            var temp = game.add.sprite(j*width_pix, i*height_pix+dt, 'new');
            temp.frame = 9;
            temp.inputEnabled = true;
            temp.events.onInputDown.add(onClick, this);
            stemp.push(temp);
        }
        sprite1.push(stemp);
    }
}

function update(){

    if(end_game){
        text1.setText("game over!      lose!");
        text2.setText("");

        if(win) text1.setText("game over!      win!");
        return;
    }

    text1.setText("s: " + count_click);
    text2.setText("m: " + count_mine);
}

function onClick(sprite){
    if(end_game)
        return;

    if(game.input.activePointer.rightButton.isDown){
        pos = get_indexs();

        if(map_lock[pos[1]][pos[0]] == 0){
            map_lock[pos[1]][pos[0]] = 2;
            sprite.frame = 12;
            count_mine--;
        }
        else if(map_lock[pos[1]][pos[0]] == 2){
            map_lock[pos[1]][pos[0]] = 0;
            sprite.frame = 9;
            count_mine++;
        }

        var ii = 0;
        for(i = 0; i < height; i++){
            for(j = 0; j < width; j++){
                if(map_lock[i][j] == 2 && map_number[i][j] == -1)
                    ii++;
            }
        }
        if(ii == mine_count){
            win = true;
            end_game = true;
        }

        return;
    }

    if(first_click == false){
        first_click = true;

        pos = get_indexs();
        generate_map(pos[0], pos[1]);
    }

    pos = get_indexs();
    if(map_lock[pos[1]][pos[0]] == 1 || map_lock[pos[1]][pos[0]] == 2)
        return;
    map_lock[pos[1]][pos[0]] = 1;

    if(map_number[pos[1]][pos[0]] == -1){
        sprite.frame = 11;
        end_game = true;

        for(i = 0; i < height; i++){
            for(j = 0; j < width; j++){
                if(i!=pos[1] && j!=pos[0] && map_number[i][j] == -1){
                    sprite1[i][j].frame = 10;
                }
            }
        }
    }
    else{
        sprite.frame = map_number[pos[1]][pos[0]];
    }

    count_click++;

    if(map_number[pos[1]][pos[0]] == 0){
        search_none1(pos[0], pos[1]);
    }
}

function search_none1(x, y){
    var arr = new Array();
    arr.push([x, y]);

    while(arr.length != 0){
        for(i = -1; i < 2; i++){
            for(j = -1; j < 2; j++){
                var xx = arr[0][0] + j;
                var yy = arr[0][1] + i;

                if(yy >= 0 && yy < height && xx >= 0 && xx < width && map_lock[yy][xx] == 0){
                    if(map_number[yy][xx] == 0){
                        arr.push([xx, yy])
                    }

                    map_lock[yy][xx] = 1;
                    sprite1[yy][xx].frame = map_number[yy][xx];
                }
            }
        }
        arr.splice(0, 1);
    }
}

function get_indexs(){
    var x = game.input.mousePointer.x;
    var y = game.input.mousePointer.y - dt;
    var xi = Math.floor(x/22.0);
    var yi = Math.floor(y/22.0);

    return [xi, yi];
}

function generate_map(ib, jb){
    for(i = 0; i < mine_count; i++){
        var ii = Math.floor((Math.random() * height) + 1);
        var jj = Math.floor((Math.random() * width) + 1);

        while(map_number[ii-1][jj-1] == -1 && (ii-1) == jb && (jj-1) == ib){
            ii = Math.floor((Math.random() * height) + 1);
            jj = Math.floor((Math.random() * width) + 1);
        }
        map_number[ii-1][jj-1] = -1;
    }

    for(i = 0; i < height; i++){
        for(j = 0; j < width; j++){
            if(map_number[i][j] == -1){
                for(ii = -1; ii < 2; ii++){
                    var x = i+ii;

                    if(x >= height){
                        break;
                    }
                    if(x < 0){
                        continue;
                    }

                    for(jj = -1; jj < 2; jj++){
                        y = j+jj;

                        if(y >= width){
                            break;
                        }
                        if(y < 0){
                            continue;
                        }

                        if(map_number[x][y] != -1){
                            map_number[x][y]++;
                        }
                    }
                }
            }
        }
    }

}
