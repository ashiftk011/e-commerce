var express = require('express');
var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    type: string,
    title: string,
    imageName: string,
    prize: number,
    description: string
});

var Item = module.exports = mongoose.model("Item", itemSchema);

