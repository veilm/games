
class Game {
  constructor() {
    this.worlds = [];
    this.players = [];
  }
  inputPlayer(player, input) {
    this.players[player].input(input);
  }
  update(time) {
    var loaded = []
    for (var i in this.worlds) {
      loaded[i] = []
    }
    for (var i in this.players) {
      this.players[i].update(time, this.worlds[this.players[i].world].friction, this.worlds[this.players[i].world].magnet);
      this.teleport(this.players[i]);
      this.worlds[this.players[i].world].collisionPlayer(this.players[i].area, this.players[i]);
      loaded[this.players[i].world][this.players[i].area] = true;
    }
    for (var i in loaded) {
      for (var j in loaded[i]) {
        if (loaded[i][j]) {
          var players = []
          for (var k in this.players) {
            if (this.players[k].world == i && this.players[k].area == j) {
              players.push(this.players[k])
            }
          }
          this.worlds[i].update(j, time, players)
        }
      }
    }
  }
  teleport(player) {
    var area = this.worlds[player.world].areas[player.area];
    var onTele = false;
    for (var i in area.zones) {
      if (area.zones[i].type == 2) {
        var pos1 = new Vector(this.worlds[player.world].pos.x + area.pos.x + area.zones[i].pos.x, this.worlds[player.world].pos.y + area.pos.y + area.zones[i].pos.y)
        var pos2 = new Vector(area.zones[i].size.x, area.zones[i].size.y)
        var teleporter = closestPointToRectangle(player.pos, pos1, pos2)
        var dist = distance(player.pos, teleporter)
        if (dist< player.radius) {
          onTele = true;
        }
        if (dist < player.radius && !player.onTele) {
          var max = Math.pow(10, 1000);
          var maxArea = 0;
          var targetPoint = new Vector(player.pos.x + area.zones[i].translate.x, player.pos.y + area.zones[i].translate.y);
          for (var j in this.worlds[player.world].areas) {
            var rect = this.worlds[player.world].areas[j].getBoundary();
            rect.x += this.worlds[player.world].areas[j].pos.x;
            rect.y += this.worlds[player.world].areas[j].pos.y;
            rect.x += this.worlds[player.world].pos.x;
            rect.y += this.worlds[player.world].pos.y;
            var closest = closestPointToRectangle(targetPoint, new Vector(rect.x, rect.y), new Vector(rect.w, rect.h))
            var dist = distance(targetPoint, closest)
            if (dist < max) {
              max = dist;
              maxArea = j;
            }
          }
          player.area = maxArea;
          player.pos = targetPoint;
          this.worlds[player.world].areas[player.area].load();
          player.dyingPos = new Vector(targetPoint.x,targetPoint.y);
        }
      }
      if (area.zones[i].type == 3) {
        var pos1 = new Vector(this.worlds[player.world].pos.x + area.pos.x + area.zones[i].pos.x, this.worlds[player.world].pos.y + area.pos.y + area.zones[i].pos.y)
        var pos2 = new Vector(area.zones[i].size.x, area.zones[i].size.y)
        var teleporter = closestPointToRectangle(player.pos, pos1, pos2)
        var dist = distance(player.pos, teleporter)
        if (dist< player.radius) {
          onTele = true;
        }
        if (dist < player.radius && !player.onTele) {
          var min = Math.pow(10, 1000);
          var minWorld = 0;
          var targetPoint = new Vector(player.pos.x + area.zones[i].translate.x, player.pos.y + area.zones[i].translate.y);
          for (var j in this.worlds) {
            var rect = this.worlds[j].areas[0].getBoundary();
            rect.x += this.worlds[j].pos.x;
            rect.y += this.worlds[j].pos.y;
            var closest = closestPointToRectangle(targetPoint, new Vector(rect.x, rect.y), new Vector(rect.w, rect.h))
            var dist = distance(targetPoint, closest)
            if (dist < min) {
              min = dist;
              minWorld = j;
            }
          }
          player.world = minWorld;
          player.pos = targetPoint;
          this.worlds[player.world].areas[player.area].load();
          player.dyingPos = new Vector(targetPoint.x,targetPoint.y);
          player.onTele = true;
        }
      }
    }
    player.onTele = onTele;
  }
  getStates(index) {
    var player = this.players[index];
    var obj = {}
    var area = this.worlds[player.world].areas[player.area]
    obj.name = this.worlds[player.world].name;
    obj.zones = area.zones;
    obj.assets = area.assets;
    obj.entities = area.entities;
    obj.background_color = area.background_color;
    obj.lighting = area.lighting;
    obj.texture = area.texture||0;
    obj.pos = new Vector(area.pos.x + this.worlds[player.world].pos.x, area.pos.y + this.worlds[player.world].pos.y)
    obj.boundary = area.getBoundary()
    return obj;
  }
}
class World {
  constructor(pos, id, map) {
    this.pos = pos;
    this.areas = [];
    this.id = id;
    this.name = "Default";
    this.background_color = "rgba(255,255,255,0)";
    this.friction = 1;
    this.lighting = 1;
    this.magnet = false;
    this.pellet_count = 25;
    this.fromJson(map)
  }
  update(area, time, players) {
    this.areas[area].update(time, players, this.pos)
  }
  collisionPlayer(area, players) {
    this.areas[area].collisionPlayer(players, this.pos)
  }
  fromJson(json) {
    this.name = json.name
    var areas = json.areas;
    var properties = json.properties
    if (properties) {
      if (properties.background_color !== undefined) {
        var color = properties.background_color
        this.background_color = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] / 255 + ")"
      }
      if (properties.title_stroke_color !== undefined) {
        var color = properties.title_stroke_color
        this.title_stroke_color = color;
      }
      if (properties.friction !== undefined) {
        this.friction = properties.friction;
      }
      if (properties.lighting !== undefined) {
        this.lighting = properties.lighting;
      }
      if (properties.magnet !== undefined) {
        this.magnet = properties.magnet;
      }
      if (properties.pellet_count !== undefined) {
        this.pellet_count = properties.pellet_count;
      }
      if (properties.texture !== undefined) {
        switch(properties.texture){
          case "leaves": this.texture = 1
            break;
          case "wooden": this.texture = 2
            break;
          case "baguette": this.texture = 3
            break;
          case "ice": this.texture = 4
            break;
          default: this.texture = 0
        }
      }
    }
    var xBase = areas[0].x;
    var yBase = areas[0].y;
    if (areas[0].x == "var x") {
      xBase = 0;
    }
    if (areas[0].y == "var y") {
      yBase = 0;
    }
    var last_height;
    var last_width;
    var last_right;
    var last_y;
    for (var i = 0; i < areas.length; i++) {
      var areaName = "Area "+(i+1);
      if (areas[i].name!==undefined) {
        areaName = areas[i].name
      }
      var areaPosX = areas[i].x - xBase;
      var areaPosY = areas[i].y - yBase;
      var zones = areas[i].zones;
      var assets = areas[i].assets;
      var propertiesC = areas[i].properties;
      if (areas[i].x == "var x") {
        areaPosX = 0;
      }
      if (areas[i].y == "var y") {
        areaPosY = 0;
      }
      if (areas[i].x.toString().startsWith("last_right")) {
        areaPosX = last_right;
      }
      if (areas[i].y.toString().startsWith("last_y")) {
        areaPosY = last_y;
      }
      if (areas[i].y.toString().startsWith("last_bottom")) {
        areaPosY = last_y;
      }
      var area = new Area(new Vector(areaPosX / 32, areaPosY / 32));
      area.name = areaName;
      area.background_color = this.background_color;
      area.title_stroke_color = this.title_stroke_color;
      area.lighting = this.lighting;
      area.pellet_count = this.pellet_count;
      area.texture = this.texture;
      if (propertiesC) {
        if (propertiesC.background_color) {
          var colorC = propertiesC.background_color
          area.background_color = "rgba(" + colorC[0] + "," + colorC[1] + "," + colorC[2] + "," + colorC[3] / 255 + ")"
          area.color = true;
        }
        if (propertiesC.title_stroke_color) {
          var colorC = propertiesC.title_stroke_color;
          area.title_stroke_color = colorC;
        }
        if (propertiesC.lighting !== undefined) {
          area.lighting = propertiesC.lighting;
        }
      }
      for (var j = 0; j < zones.length; j++) {
        var type = 0;
        if (zones[j].type == "active") {
          type = 0
        }
        if (zones[j].type == "safe") {
          type = 1
        }
        if (zones[j].type == "exit") {
          type = 2
        }
        if (zones[j].type == "teleport") {
          type = 3
        }
        if (zones[j].type == "victory") {
          type = 4
        }
        if (zones[j].type == "removal") {
          type = 5
        }
        var areax = zones[j].x;
        var areay = zones[j].y;
        if (areax.toString().startsWith("last_right")) {
          areax = last_right - areaPosX;
        }
        if (areay.toString().startsWith("last_y")) {
          areay = last_y;
        }
        if (areay.toString().startsWith("last_bottom")) {
          areay = last_y;
        }
        var xPos = areaPosX + areax;
        var yPos = areaPosY + areay;
        var spawner = zones[j].spawner;
        var widthSize = zones[j].width;
        var heightSize = zones[j].height
        if (heightSize.toString().startsWith("last_height")) {
          heightSize = last_height;
        }
        if (widthSize.toString().startsWith("last_width")) {
          widthSize = last_width;
        }
        var block = new Zone(new Vector(xPos / 32 - areaPosX / 32, yPos / 32 - areaPosY / 32), new Vector(widthSize / 32, heightSize / 32), type);
        block.background_color = area.background_color
        if (zones[j].properties!==undefined) {
          if (zones[j].properties.background_color!==undefined) {
            var colorC = zones[j].properties.background_color
            block.color = true;
            block.background_color = "rgba(" + colorC[0] + "," + colorC[1] + "," + colorC[2] + "," + colorC[3] / 255 + ")"
          }
          if(zones[j].properties.minimum_speed!==undefined){
            block.minimum_speed=zones[j].properties.minimum_speed;
          }
        }
        else if(zones.type == 4){
          //block.color = true;
          //block.background_color = "rgb(255,244,108,255)";
        }
        if (zones[j].type == "teleport" || zones[j].type == "exit") {
          block.translate = new Vector(zones[j].translate.x / 32, zones[j].translate.y / 32);
        }
        for (var k in spawner) {
          var values = spawner[k];
          var count = values.count
          if (count==undefined) {
            count = 1;
          }
          var object = {
            type: values.types,
            radius: values.radius,
            speed: values.speed,//*1.25,
            count: count,//Math.ceil(count*1.25),
            x:values.x,
            y:values.y,
          }
          if(object.type == "frost_giant"){
            object.angle = values.angle;
            object.direction = values.direction;
            object.turn_speed = values.turn_speed;
            object.shot_interval = values.shot_interval;
            object.cone_angle = values.cone_angle;
            object.pause_interval = values.pause_interval;
            object.pause_duration = values.pause_duration;
            object.turn_acceleration = values.turn_acceleration;
            object.shot_acceleration = values.shot_acceleration;
            object.pattern = values.pattern;
            object.immune = values.immune;
            object.projectile_duration = values.projectile_duration;
            object.projectile_radius = values.projectile_radius;
            object.projectile_speed = values.projectile_speed;
          }
          if (values.move_clockwise!==undefined) {
            object.move_clockwise = values.move_clockwise
          }
          if (values.horizontal!==undefined) {
            object.horizontal = values.horizontal
          }
          area.preset.push(object);
        }
        area.zones.push(block);
        last_y = areay;
        last_right = xPos + widthSize;
        last_height = heightSize;
        last_width = widthSize;
      }
      for (var k in assets) {
        var type = 0;
        var texture;
        if (assets[k].type == "wall") {
          type = 1
          if (assets[k].texture=="normal") {
            texture = 0
          }
          if (assets[k].texture=="leaves") {
            texture = 1
          }
          if (assets[k].texture=="wooden") {
            texture = 2
          }
          if (assets[k].texture=="baguette") {
            texture = 3
          }
          if (assets[k].texture=="ice") {
            texture = 4
          }
        }
        if (assets[k].type == "light_region") {
          type = 4;
        }
        if (assets[k].type == "flashlight_spawner") {
          type = 5;
        }
        if (assets[k].type == "torch") {
          type = 6;
        }
        if (assets[k].type == "gate") {
          type = 7;
        }
        if (assets[k].type == "torch"&&assets[k].upside_down) {
          type = 8;
        }
        var areax = assets[k].x;
        var areay = assets[k].y;
        var xPos = areaPosX + areax;
        var yPos = areaPosY + areay;
        var widthSize = assets[k].width;
        var heightSize = assets[k].height;
        var block = new Asset(new Vector(xPos / 32 - areaPosX / 32, yPos / 32 - areaPosY / 32), new Vector(widthSize / 32, heightSize / 32), type);
        if (texture!==undefined) {
          block.texture = texture
        }
        if (type!==0) {
          area.assets.push(block);
        }
      }
      this.areas.push(area);
    }
  }
}
class Area {
  constructor(pos) {
    this.pos = pos;
    this.zones = [];
    this.assets = [];
    this.entities = {};
    this.preset = [];
    this.background_color = "rgba(255,255,255,0)";
    this.name = "undefined";
    this.lighting = 1;
  }
  update(time, players, worldPos) {
    var boundary = this.getActiveBoundary();
    //update entities
    //console.log(this)
    for (var i in this.entities) {
      for (var j in this.entities[i]) {
        this.entities[i][j].update(time);
        this.entities[i][j].colide(boundary);
        for (var v in this.assets) {
          if (this.assets[v].type==1) {
            var rect = {x:this.assets[v].pos.x,y:this.assets[v].pos.y,w:this.assets[v].size.x,h:this.assets[v].size.y,t:false,wall:true}
            this.entities[i][j].colide(rect);
          }}
        if(this.eng == 3){for(var v in this.zones){
          if(this.zones[v].type==1){
            var rect = {x:this.zones[v].pos.x,y:this.zones[v].pos.y,w:this.zones[v].size.x,h:this.zones[v].size.y,t:false,wall:true}
            this.entities[i][j].colide(rect);
          }
        }}
        this.entities[i][j].behavior(time, this, {
          x: this.pos.x + worldPos.x,
          y: this.pos.y + worldPos.y
        }, players)
      }
    }
    //reemove toRemove
    var newEntities = {}
    for (var i in this.entities) {
      newEntities[i] = []
      for (var j in this.entities[i]) {
        if (this.entities[i][j].toRemove) {} else {
          newEntities[i].push(this.entities[i][j]);
        }
      }
    }
    this.entities = newEntities
    //remove weaks one
    var newEntities = {}
    for (var i in this.entities) {
      newEntities[i] = []
      for (var j in this.entities[i]) {
        var inside = pointInRectangle(this.entities[i][j].pos, {
          x: boundary.x + this.entities[i][j].radius,
          y: boundary.y + this.entities[i][j].radius
        }, {
          x: boundary.w - this.entities[i][j].radius * 2,
          y: boundary.h - this.entities[i][j].radius * 2
        })
        if (!inside && this.entities[i][j].weak) {} else {
          newEntities[i].push(this.entities[i][j]);
        }
      }
    }
    this.entities = newEntities
    //teleport them inside the area
    for (var i in this.entities) {
      for (var j in this.entities[i]) {
        if (this.entities[i][j].collide && !this.entities[i][j].no_collide) {
          var fixed = closestPointToRectangle(this.entities[i][j].pos, {
            x: boundary.x + this.entities[i][j].radius,
            y: boundary.y + this.entities[i][j].radius
          }, {
            x: boundary.w - this.entities[i][j].radius * 2,
            y: boundary.h - this.entities[i][j].radius * 2
          })
          this.entities[i][j].pos = fixed;
        }
      }
    }
    //colide with players
    for (var i in players) {
      players[i].abilities(time, this, {x: this.pos.x + worldPos.x,y: this.pos.y + worldPos.y})
      for (var j in this.entities) {
        for (var k in this.entities[j]) {
          this.entities[j][k].interact(players[i],{
            x: this.pos.x + worldPos.x,
            y: this.pos.y + worldPos.y
          },time)
        }
      }
    }
  }
  getBoundary() {
    var minx;
    var miny;
    var maxx;
    var maxy;
    for (var i in this.zones) {
      var zone = this.zones[i];
      if (minx == undefined) {
        minx = zone.pos.x;
      }
      if (miny == undefined) {
        miny = zone.pos.y;
      }
      if (maxx == undefined) {
        maxx = zone.pos.x + zone.size.x;
      }
      if (maxy == undefined) {
        maxy = zone.pos.y + zone.size.y;
      }
      if (zone.pos.x < minx) {
        minx = zone.pos.x;
      }
      if (zone.pos.y < miny) {
        miny = zone.pos.y;
      }
      if (zone.pos.x + zone.size.x > maxx) {
        maxx = zone.pos.x + zone.size.x;
      }
      if (zone.pos.y + zone.size.y > maxy) {
        maxy = zone.pos.y + zone.size.y;
      }
    }
    return {
      x: minx,
      y: miny,
      w: maxx - minx,
      h: maxy - miny
    }
  }
  getActiveBoundary() {
    var minx;
    var miny;
    var maxx;
    var maxy;
    var wasv;
    for (var i in this.zones) {
      if(this.zones[i].type == 4){wasv = true}
      if (this.zones[i].type == 0||this.zones[i].type == 4) {
        var zone = this.zones[i];
        if (minx == undefined) {
          minx = zone.pos.x;
        }
        if (miny == undefined) {
          miny = zone.pos.y;
        }
        if (maxx == undefined) {
          maxx = zone.pos.x + zone.size.x;
        }
        if (maxy == undefined) {
          maxy = zone.pos.y + zone.size.y;
        }
        if (zone.pos.x < minx) {
          minx = zone.pos.x;
        }
        if (zone.pos.y < miny) {
          miny = zone.pos.y;
        }
        if (zone.pos.x + zone.size.x > maxx) {
          maxx = zone.pos.x + zone.size.x;
        }
        if (zone.pos.y + zone.size.y > maxy) {
          maxy = zone.pos.y + zone.size.y;
        }
      }
    }
    return {
      x: minx,
      y: miny,
      w: maxx - minx,
      h: maxy - miny,
      t: (wasv) ? true : false
    }
  }
  collisionPlayer(player, worldPos) {
    var boundary = this.getBoundary();
    boundary.x += this.pos.x;
    boundary.y += this.pos.y;
    boundary.x += worldPos.x;
    boundary.y += worldPos.y;
    var fixed = closestPointToRectangle(player.pos, new Vector(boundary.x + player.radius, boundary.y + player.radius), new Vector(boundary.w - player.radius * 2, boundary.h - player.radius * 2));
    if (Math.abs(fixed.x-player.pos.x)+Math.abs(fixed.y-player.pos.y)!==0) {
      player.vel = new Vector(0,0);
      player.collides = true;
    } else {player.collides = false;}
    player.pos.x = fixed.x;
    player.pos.y = fixed.y;
    for (var i in this.assets) {
      if (this.assets[i].type==1) {
        var rectHalfSizeX = this.assets[i].size.x / 2;
        var rectHalfSizeY = this.assets[i].size.y / 2;
        var rectCenterX = this.assets[i].pos.x + this.pos.x + worldPos.x + rectHalfSizeX;
        var rectCenterY = this.assets[i].pos.y + this.pos.y + worldPos.y + rectHalfSizeY;
        var distX = Math.abs(player.pos.x - rectCenterX);
        var distY = Math.abs(player.pos.y - rectCenterY);
        if ((distX < rectHalfSizeX + player.radius) && (distY < rectHalfSizeY + player.radius)) {
          player.collides = true;
          // Collision
          var relX = (player.pos.x - rectCenterX) / rectHalfSizeX;
          var relY = (player.pos.y - rectCenterY) / rectHalfSizeY;
          if (Math.abs(relX) > Math.abs(relY)) {
            // Horizontal collision.
            if (relX > 0) {
              // Right collision
              player.pos.x = rectCenterX + rectHalfSizeX + player.radius;
              player.vel.x = 0;
            } else {
              // Left collision
              player.pos.x = rectCenterX - rectHalfSizeX - player.radius;
              player.vel.x = 0;
            }
          } else {
            // Vertical collision
            if (relY < 0) {
              // Up collision
              player.pos.y = rectCenterY - rectHalfSizeY - player.radius;
              player.vel.y = 0;
            } else {
              // Bottom collision
              player.pos.y = rectCenterY + rectHalfSizeY + player.radius;
              player.vel.y = 0;
            }
          }
        }
      }
    }
  }
  load() {
    this.entities = {}
    var boundary = this.getActiveBoundary();
    for (var i in this.preset) {
      if (!this.entities[this.preset[i].type]) {
        this.entities[this.preset[i].type] = []
      }
      var count = this.preset[i].count;
      if (count==undefined) {
        count = 1;
      }
      for (var j = 0; j < this.preset[i].count; j++) {
        var posX = Math.random() * boundary.w + boundary.x;
        var posY = Math.random() * boundary.h + boundary.y;
        if (this.preset[i].x!==undefined) {
          var posX = this.preset[i].x/32;
        }
        if (this.preset[i].y!==undefined) {
          var posY = this.preset[i].y/32;
        }
        var rand = Math.floor(Math.random() * this.preset[i].type.length);
        var enemy = new Unknown(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        if (this.preset[i].type[rand] == "normal") {
          enemy = new Normal(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "wall") {
          enemy = new Wall(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed, this.getActiveBoundary(), j, this.preset[i].count,this.preset[i].move_clockwise)
        }
        if (this.preset[i].type[rand] == "dasher") {
          enemy = new Dasher(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "homing") {
          enemy = new Homing(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "slowing") {
          enemy = new Slowing(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "draining") {
          enemy = new Draining(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "oscillating") {
          enemy = new Oscillating(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "turning") {
          enemy = new Turning(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "liquid") {
          enemy = new Liquid(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "sizing") {
          enemy = new Sizing(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "switch") {
          enemy = new Switch(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed, j, this.preset[i].count)
        }
        if (this.preset[i].type[rand] == "sniper") {
          enemy = new Sniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "freezing") {
          enemy = new Freezing(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "teleporting") {
          enemy = new Teleporting(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "immune") {
          enemy = new Immune(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "ice_sniper") {
          enemy = new IceSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "disabling") {
          enemy = new Disabling(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "toxic") {
          enemy = new Toxic(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "icicle") {
          enemy = new Icicle(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed,this.preset[i].horizontal)
        }
        if (this.preset[i].type[rand] == "spiral") {
          enemy = new Spiral(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "gravity") {
          enemy = new Gravity(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "repelling") {
          enemy = new Repelling(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "wavy") {
          enemy = new Wavy(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "zigzag") {
          enemy = new Zigzag(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "zoning") {
          enemy = new Zoning(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "radiating_bullets") {
          enemy = new Radiating(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "frost_giant") {
          enemy = new FrostGiant(new Vector(posX, posY), this.preset[i].radius / 32, (this.preset[i].speed) ? this.preset[i].speed : 0, this.preset[i].angle,this.preset[i].direction,this.preset[i].turn_speed,this.preset[i].shot_interval,this.preset[i].cone_angle,this.preset[i].pause_interval,this.preset[i].pause_duration,this.preset[i].turn_acceleration,this.preset[i].shot_acceleration,this.preset[i].pattern,this.preset[i].immune,this.preset[i].projectile_duration,this.preset[i].projectile_radius,this.preset[i].projectile_speed)
        }
        if (this.preset[i].type[rand] == "speed_sniper") {
          enemy = new SpeedSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "regen_sniper") {
          enemy = new RegenSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "snowman") {
          enemy = new Snowman(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "slippery") {
          enemy = new Slippery(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "corrosive") {
          enemy = new Corrosive(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "corrosive_sniper") {
          enemy = new CorrosiveSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "enlarging") {
          enemy = new Enlarging(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "poison_sniper") {
          enemy = new PoisonSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "magnetic_reduction") {
          enemy = new MagneticReduction(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "magnetic_nullification") {
          enemy = new MagneticNullification(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "positive_magnetic_sniper") {
          enemy = new PositiveMagneticSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "negative_magnetic_sniper") {
          enemy = new NegativeMagneticSniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "tree") {
          enemy = new Tree(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "pumpkin") {
          enemy = new Pumpkin(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "fake_pumpkin") {
          enemy = new FakePumpkin(new Vector(posX, posY), 0,this.preset[i].radius / 32, 0)
        }
        if (this.preset[i].type[rand] == "experience_drain") {
          enemy = new ExperienceDraining(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "fire_trail") {
          enemy = new Fire_Trail(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "wind") {
          enemy = new Wind(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "burning") {
          enemy = new Burning(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        if (this.preset[i].type[rand] == "sticky_sniper") {
          enemy = new StickySniper(new Vector(posX, posY), this.preset[i].radius / 32, this.preset[i].speed)
        }
        enemy.isSpawned = true;
        this.entities[this.preset[i].type].push(enemy)
      }
    }
    this.entities["pellet"] = []
    var pelletsAtZone = this.pellet_count;
    if(boundary.t){pelletsAtZone = 200}
    for (var i = 0; i < pelletsAtZone; i++) {
      var posX = Math.random() * boundary.w + boundary.x;
      var posY = Math.random() * boundary.h + boundary.y;
      var pellet = new Pellet(new Vector(posX, posY))
      this.entities["pellet"].push(pellet)
    }
  }
  addEffect(type,pos){
    if(type == 0){
      if(!this.entities["SweetTooth"]){this.entities["SweetTooth"] = []}
      var effect = new SweetTooth(new Vector(pos.x,pos.y))
      this.entities["SweetTooth"].push(effect)
    }
  }
  addSniperBullet(type, pos, angle, radius, speed, duration = 4000) {
    if (type == 0) {
      if (!this.entities["SniperProjectile"]) {
        this.entities["SniperProjectile"] = []
      }
      var bullet = new SniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["SniperProjectile"].push(bullet)
    }
    if (type == 1) {
      if (!this.entities["IceSniperProjectile"]) {
        this.entities["IceSniperProjectile"] = []
      }
      var bullet = new IceSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["IceSniperProjectile"].push(bullet)
    }
    if (type == 2) {
      if (!this.entities["RadiatingProjectile"]) {
        this.entities["RadiatingProjectile"] = []
      }
      var bullet = new RadiatingBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["RadiatingProjectile"].push(bullet)
    }
    if (type == 3) {
      if (!this.entities["SpeedProjectile"]) {
        this.entities["SpeedProjectile"] = []
      }
      var bullet = new SpeedSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["SpeedProjectile"].push(bullet)
    }
    if (type == 4) {
      if (!this.entities["RegenProjectile"]) {
        this.entities["RegenProjectile"] = []
      }
      var bullet = new RegenSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["RegenProjectile"].push(bullet)
    }
    if (type == 5) {
      if (!this.entities["CorrosiveSniperProjectile"]) {
        this.entities["CorrosiveSniperProjectile"] = []
      }
      var bullet = new CorrosiveSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["CorrosiveSniperProjectile"].push(bullet)
    }
    if (type == 6) {
      if (!this.entities["PoisonSniperProjectile"]) {
        this.entities["PoisonSniperProjectile"] = []
      }
      var bullet = new PoisonSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["PoisonSniperProjectile"].push(bullet)
    }
    if (type == 7) {
      if (!this.entities["PositiveMagneticSniperProjectile"]) {
        this.entities["PositiveMagneticSniperProjectile"] = []
      }
      var bullet = new PositiveMagneticSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["PositiveMagneticSniperProjectile"].push(bullet)
    }
    if (type == 8) {
      if (!this.entities["NegativeMagneticSniperProjectile"]) {
        this.entities["NegativeMagneticSniperProjectile"] = []
      }
      var bullet = new NegativeMagneticSniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["NegativeMagneticSniperProjectile"].push(bullet)
    }
    if (type == 9) {
      if (!this.entities["frost_giant_ice_projectile"]) {
        this.entities["frost_giant_ice_projectile"] = []
      }
      var bullet = new frost_giant_ice_bullet(new Vector(pos.x,pos.y), angle, radius, speed, duration);
      this.entities["frost_giant_ice_projectile"].push(bullet)
    }
    if (type == 10){
      if (!this.entities["leaf_projectile"]) {
        this.entities["leaf_projectile"] = []
      }
      var bullet = new leaf_projectile(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["leaf_projectile"].push(bullet)
    }
    if (type == 11){
      if (!this.entities["sticky_projectile"]) {
        this.entities["sticky_projectile"] = []
      }
      var bullet = new StickySniperBullet(new Vector(pos.x,pos.y), angle, radius, speed);
      this.entities["sticky_projectile"].push(bullet)
    }
  }
  addEntity(entityName,entity){
    if (this.entities[entityName]==undefined) {
      this.entities[entityName] = []
    }
    this.entities[entityName].push(entity);
  }
}
class Zone {
  constructor(pos, size, type) {
    this.pos = new Vector(pos.x, pos.y);
    this.size = new Vector(size.x, size.y);
    this.type = type;
    this.background_color = "rgba(255,255,255,0)";
  }
}
class Asset {
  constructor(pos, size, type) {
    this.pos = new Vector(pos.x, pos.y);
    this.size = new Vector(size.x, size.y);
    this.type = type;
  }
}
