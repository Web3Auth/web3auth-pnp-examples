package com.example.android_playground.utils

fun String.addressAbbreviation() = substring(0, 5) + "..." + substring(length - 5)