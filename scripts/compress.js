//js jmvcdoc/compress.js

load("steal/compress/compress.js")
var compress = new Steal.Compress(['jmvcdoc/jmvcdoc.html',
                                   'jmvcdoc']);
compress.init();