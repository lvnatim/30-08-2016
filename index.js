const request = require("request");
const cheerio = require("cheerio");
const fileSystem = require("fs");

const URL = "http://substack.net/images/";
const FILE_OUTPUT = "images.csv";

// make request

// request(URL, (error, response, body)=>{
//   if (!error && response.statusCode === 200){
//     $ = cheerio.load(body);
//     $('tr').each(function(index, element){
//       filterData($(this));
//     });
//   };
// });

// filter data

function filterData(jqObject){

  // TODO: remove REGEX

  fileName = jqObject
    .find("a")
    .text();
  permissions = jqObject
    .html()
    .match(/\(.+\)/)[0];
  ext = findFiletype(fileName)
  absUrl = URL + fileName;

  return permissions + "," + absUrl + "," + ext + "\n";
} 

// function that determines filetype from string

function findFiletype(string){
  ext = string.match(/\.\w+$/);
  if(ext){
    return ext[0]
  } else {
    return "dir"
  }
}


// write results into the .csv file
fileStream = fileSystem.createWriteStream(FILE_OUTPUT);
fileStream.on("open", function(fd){

  request(URL, (error, response, body)=>{

    if (!error && response.statusCode === 200){

      $ = cheerio.load(body);
      $('tr').each(function(index, element){
        csvData = filterData($(this));
        fileSystem.writeSync(fd, csvData, function(){
          console.log("String done, moving on.")
        });
      });

    };

  });

});



