// Bascic coding and explanation for data structures

//-----------------------------------------
// Stacks - Add and remove from the same side of the array (presumably the top);

function Stack () {
  // this.stack = [];
  this.stack = new LinkedList();
}

Stack.prototype.add = function (item) {
  // this.stack.push(item);
  this.stack.addToTail(item);
  return this;
};

Stack.prototype.remove = function () {
  // return this.stack.pop();
  return this.stack.removeFromTail();
};

//-----------------------------------------
// Queues- Add and remove from opposite sides of the array;

function Queue () {
  // this.queue = [];
  this.queue = new LinkedList();
}

Queue.prototype.add = function (item) {
  // this.queue.push(item);
  this.queue.addToTail(item);
  return this;
};

Queue.prototype.remove = function () {
  // return this.queue.shift();
  return this.queue.removeFromHead();
};

//-----------------------------------------
// Linked lists - Have pointers that indicate which item is before and/or after them. 

function LinkedList () {
  this.head = this.tail = null;
}

function ListNode (item, prev, next) {
  this.item = item;
  this.next = next || null;
  this.prev = prev || null;
}

LinkedList.prototype.addToTail = function (item) {
  if(!this.tail) this.head = this.tail = new ListNode(item);
  else {
    this.tail.next = new ListNode(item, this.tail);
    this.tail = this.tail.next;
  }
  return this;
};

LinkedList.prototype.removeFromTail = function () {
  if(!this.tail) return undefined;
  var val = this.tail.item;

  if(this.tail.prev){
    this.tail = this.tail.prev;
    this.tail.next = null;
  } else {
    this.head = this.tail = null;
  }
  return val;
};

LinkedList.prototype.removeFromHead = function () {
  if(!this.head) return undefined;
  var val = this.head.item;

  if(this.head.next){
    this.head = this.head.next;
    this.head.prev = null;
  } else {
    this.tail = this.head = null;
  }
  return val;
};

LinkedList.prototype.forEach = function (iterator) {
  var currentHead = this.head;
  while(currentHead) {
    iterator(currentHead.item);
    currentHead = currentHead.next;
  }
};

//-----------------------------------------
// Association lists - Bascially a Javascript Object

function Alist () {
  this.head = null;
}

function AlistNode (key, value, next) {
  this.key = key;
  this.value = value;
  this.next = next;
}

Alist.prototype.set = function (key, value) {
  this.head = new AlistNode(key, value, this.head);
  return this; // for chaining; do not edit
};

Alist.prototype.get = function (key) {
  var currentHead = this.head;
  while(currentHead) {
    if(currentHead.key===key) return currentHead.value;
    currentHead = currentHead.next;
  }
};


//-----------------------------------------
// Hash tables - stores values at hashed indices instead of keyed indices

function hash (key) {
  var hashedKey = 0;
  for (var i = 0; i < key.length; i++) {
    hashedKey += key.charCodeAt(i);
  }
  return hashedKey % 20;
}

function HashTable () {
  this.buckets = Array(20);
  for (var i = 0; i < this.buckets.length; i++) {
    this.buckets[i] = new Alist;
  }
}

HashTable.prototype.set = function (key, value) {
  this.buckets[hash(key)].set(key,value);
  return this;
};

HashTable.prototype.get = function (key) {
  return this.buckets[hash(key)].get(key);
};

//-----------------------------------------
// Binary search trees - creates a tree that nests trees based on their relative values 

function BinarySearchTree (val) {
  this.value = val;
  this.left = null;
  this.right = null;
}

BinarySearchTree.prototype.insert = function (val) {;
  if(val<this.value) {
    if(!this.left) this.left = new BinarySearchTree(val);
    else this.left.insert(val);
  } else {
    if(!this.right) this.right = new BinarySearchTree(val);
    else this.right.insert(val);
  }

  return this;
};

BinarySearchTree.prototype.min = function () {
  // Without recursion
  var smaller = this;
  while(smaller.left){
    smaller = smaller.left;
  }
  return smaller.value;
};

BinarySearchTree.prototype.max = function () {
  // With recursion
  if(this.right) return this.right.max();
  return this.value;
};

BinarySearchTree.prototype.contains = function (val) {
  if(val===this.value) return true;
  if(val<this.value && this.left) {
    return this.left.contains(val);
  } else if (this.right){
    return this.right.contains(val);
  }

  return false;

};

BinarySearchTree.prototype.traverse = function (iterator) {
  if(this.left) this.left.traverse(iterator);
    iterator(this.value);
  if(this.right) this.right.traverse(iterator);
};
