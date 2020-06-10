let cities = [];
var totalcities = 12;
let recordDistance = Infinity;
var bestEver;
let population = [];
let popSize = 500;
let fitness = [];
let currentBest = [];

function setup() {
  createCanvas(600, 600);

  var order = [];
  for (var i = 0; i < totalcities; i++) {
    var v = createVector(random(width), random(height / 2));
    cities[i] = v;
    order[i] = i;
  }

  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
}

function draw() {
  background(0);

  calculateFitness();
  normalizeFitness();
  nextGeneration();

  beginShape();
  for (var i = 0; i < bestEver.length; i++) {
    strokeWeight(1);
    noFill();
    stroke(255);
    let n = bestEver[i];
    ellipse(cities[n].x, cities[n].y, 8, 8);
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  translate(0, height / 2);
  beginShape();
  for (var i = 0; i < currentBest.length; i++) {
    strokeWeight(1);
    noFill();
    stroke(255);
    let n = currentBest[i];
    ellipse(cities[n].x, cities[n].y, 8, 8);
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  textSize(32);
  fill(255);
  noStroke();
  text("Best distance : " + nf(recordDistance, 0, 2), 20, height / 2 - 20);
}

function calcDistance(points, order) {
  let sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    let cityAindex = order[i];
    let cityA = points[cityAindex];
    let cityBindex = order[i + 1];
    let cityB = points[cityBindex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function swap(a, i, j) {
  let temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calculateFitness() {
  var currentDistance = Infinity;
  for (var i = 0; i < population.length; i++) {
    var d = calcDistance(cities, population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }

    if (d < currentDistance) {
      currentDistance = d;
      currentBest = population[i];
    }

    //fitness[i] = 1 / (d + 1);
    //A better fitness function;
    fitness[i] = 1 / (pow(d, 8) + 1);
  }
}

function normalizeFitness() {
  let sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }

  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;
}

function crossOver(orderA, orderB) {
  let start = floor(random(orderA.length));
  let end = floor(random(start + 1, orderA.length));
  let newOrder = orderA.slice(start, end);

  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!newOrder.includes(city)) {
      newOrder.push(city);
    }
  }
  return newOrder;
}

function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function mutate(order, mutationRate) {
  for (var i = 0; i < totalcities; i++) {
    if (random(1) < mutationRate) {
      var indexA = floor(random(order.length));
      //var indexB = floor(random(order.length));
      var indexB = (indexA + 1) % totalcities;
      swap(order, indexA, indexB);
    }
  }
}
