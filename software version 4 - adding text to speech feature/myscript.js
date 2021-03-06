///---------------------------initial words list with wordcounts----------------
var wordlist={
    list: ['all', 'barron', 'magoosh'],
    wordcount: [1867, 800, 1067]
};

///----------------------------configuration section----------------------------

///listening events to track the word list change event
document.getElementById("wordlist").addEventListener("change", setrangevalue);

function setrangevalue(){
    var sel_value=document.getElementById('wordlist').value;
    var ind = wordlist.list.indexOf(sel_value);
    var maxwordcount=wordlist.wordcount[ind];

    document.getElementById("firstword").value=1;
    document.getElementById("firstword").max=maxwordcount;

    document.getElementById("lastword").value=maxwordcount;
    document.getElementById("lastword").max=maxwordcount;

    document.getElementById('rangemsg').textContent="Choose words between 1 to "+maxwordcount+" range.";
}

///calling first time to set the initial word list and corresponding max-min values
setrangevalue();




///---------------------------loading vocabulary words--------------------------

// listening events to catch the load word button operation
document.getElementById("loadvocabulary").addEventListener("click", loadvocabulary);

function loadvocabulary(){
    var sel_value=document.getElementById('wordlist').value;
    var word_array_name=sel_value+"words"; ///the words array name is "barronwords" for barron word list.
    var meaning_array_name=sel_value+"meanings";
    var ind = wordlist.list.indexOf(sel_value);
    var maxwordcount=wordlist.wordcount[ind];

    var minval=parseInt(document.getElementById('firstword').value);
    var maxval=parseInt(document.getElementById('lastword').value);
    if(isNaN(minval) || isNaN(maxval) || minval>maxval || minval>maxwordcount || maxval>maxwordcount){
        document.getElementById('alertbox').innerHTML='<div class="alert alert-danger alert-dismissible fade show col-12" role="alert"><strong>ERROR!!!!</strong> Invalid first or, last word number.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
    else{
        document.getElementById('tablecontainer').innerHTML='<div class="spinner-grow text-warning" role="status"></div> <div class="spinner-grow text-info" role="status"></div> <div class="spinner-grow text-success" role="status"></div>';

        ///giving 2 sec delay for showing the loading icons
        setTimeout(loadingwords, 2000, minval, maxval, word_array_name, meaning_array_name);
    }
}

function loadingwords(minval, maxval, word_array_name, meaning_array_name){
    var contentHTML='<div class="accordion" id="myaccordion">';
    contentHTML+='<table class="table table-hover"><tbody>';
    ///index number is 1 less than minval/maxval
    for(let i=minval-1;i<maxval;i++){
        contentHTML+='<tr><td id="'+window[word_array_name][i].toLowerCase()+'"><a data-toggle="collapse" href="#collapseid'+i+'" role="button">'+window[word_array_name][i].toLowerCase()+'</a>';
        contentHTML+='<div class="collapse" data-parent="#myaccordion" id="collapseid'+i+'"><div class="card card-body">'+window[meaning_array_name][i].toLowerCase()+'</div></td></tr>';
    }
    contentHTML += "</tbody></table></div>";

    document.getElementById("tablecontainer").innerHTML=contentHTML;

    ///reinitializing to random word
    wordpos=-1;
    document.getElementById('randword').textContent="Random";
    document.getElementById('randwordmeaning').textContent="See the random word meaning here ... ...";

    ///activating the prev, rand, next word buttons
    document.getElementById('prev').removeAttribute('disabled');
    document.getElementById('rand').removeAttribute('disabled');
    document.getElementById('next').removeAttribute('disabled');
    document.getElementById('searchbtn').removeAttribute('disabled');
}

///----------------prev, rend, next button functionalities----------------------

document.getElementById('rand').addEventListener('click', genword);
document.getElementById('prev').addEventListener('click', genword);
document.getElementById('next').addEventListener('click', genword);

///wordpos = global variable to track the currently showing words in the flashcard
var wordpos=-1; ///initial word position
function randompos(minval, maxval){
    return getRandomIntInclusive(minval, maxval); ///index is 1 less
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function prevpos(minval, maxval){
    var newpos=maxval;
    if(wordpos!=-1) newpos=wordpos-1;
    ///circular rotation
    if(newpos<minval){
        newpos=maxval;
    }

    return newpos;
}

function nextpos(minval, maxval){
    var newpos=minval;
    if(wordpos!=-1) newpos=wordpos+1;
    ///circular rotation
    if(newpos>maxval){
        newpos=minval;
    }
    return newpos;
}

function genword(e){
    var cat=e.target.id; ///id will return either prev, rand or next id of HTML

    var sel_value=document.getElementById('wordlist').value;
    var word_array_name=sel_value+"words";
    var meaning_array_name=sel_value+"meanings";
    var ind = wordlist.list.indexOf(sel_value);
    var maxwordcount=wordlist.wordcount[ind];

    var minval=parseInt(document.getElementById('firstword').value);
    var maxval=parseInt(document.getElementById('lastword').value);
    if(isNaN(minval) || isNaN(maxval) || minval>maxval || minval>maxwordcount || maxval>maxwordcount){
        ///no operation for wrong configuration
    }
    else{
        ///if the configuration is valid
        // console.log(minval+" "+maxval);
        if(cat=='rand'){
            wordpos=randompos(minval-1, maxval-1); ///index is 1 less
        }
        else if(cat=='prev'){
            wordpos=prevpos(minval-1, maxval-1);
        }
        else if(cat=='next'){
            wordpos=nextpos(minval-1, maxval-1);
        }

        console.log(cat+" "+wordpos);
        if(wordpos!=-1){
            document.getElementById('randword').textContent=window[word_array_name][wordpos].toLowerCase();
            document.getElementById('randwordmeaning').textContent=window[meaning_array_name][wordpos].toLowerCase();
        }
        else{
            document.getElementById('randword').textContent="Random";
            document.getElementById('randwordmeaning').textContent="See the random word meaning here ... ...";
        }
    }
}


///-----------------------marking words for future use--------------------------

var markedwords=[]; ///tracking words to turn off the same word repetition
document.getElementById('markword').addEventListener('click', addmarkedword);

function addmarkedword(e){
    e.preventDefault(); ///disabling default link click effect

    var sel_value=document.getElementById('wordlist').value;
    var word_array_name=sel_value+"words";
    var meaning_array_name=sel_value+"meanings";

    if(wordpos!=-1){
        var newword=window[word_array_name][wordpos].toLowerCase();
        var newwordmeaning=window[meaning_array_name][wordpos].toLowerCase();
        ///checking whether the word already exists or not
        if(markedwords.indexOf(newword)==-1){
            markedwords.push(newword);

            ///adding new word element here
            var newchild=document.createElement('div');
            newchild.setAttribute("class","m-2 p-1 border border-info rounded-pill float-left d-inline");
            newchild.setAttribute("meaning",newwordmeaning);
            newchild.setAttribute("id", "d-"+newword); ///as repetition is off so same word will appear only one time. No id repetition
            newchild.innerHTML='<a href="#" onclick="showmarkedwordmeaning(event,\''+newwordmeaning+'\')">'+newword+'</a> <a href="#" class="text-danger font-weight-bold" onclick="removeme(event, \''+"d-"+newword+'\')">&times;</a>';

            var elm=document.getElementById('markedword');
            elm.appendChild(newchild);
        }
        else{
            console.log('already marked');
        }
    }
    else{
        console.log("No word");
    }
}

function showmarkedwordmeaning(e, newwordmeaning){
    e.preventDefault();
    document.getElementById('markedmeaning').textContent=newwordmeaning;
}

function removeme(e, newword){
    e.preventDefault();
    console.log("deleting: "+newword);
    
    var me=document.getElementById(newword);
    var parent=document.getElementById('markedword');

    parent.removeChild(me);

    document.getElementById('markedmeaning').textContent="";


    var mypos=markedwords.indexOf(newword);
    markedwords.splice(mypos, 1);
    console.log(markedwords);
}


///-------------------search button click event handling------------------------

document.getElementById('searchbtn').addEventListener('click', searchdata);

function searchdata(){
    var sel_value=document.getElementById('wordlist').value;
    var word_array_name=sel_value+"words";
    var maxwordcount=window[word_array_name].length;

    var searchval=document.getElementById('searchval').value;
    var pos=window[word_array_name].indexOf(searchval);
    if(pos!=-1){
        console.log('found at position '+pos);
        var parent=document.querySelector('#tablecontainer');
        ///parent.scrollTop=(parent.scrollHeight/maxwordcount)*pos; ///calculating the postion of pos-th table row
        var tdelm = document.getElementById(searchval);
        var trelm=tdelm.parentNode;
        if(trelm){
            var half_window_size = parent.clientHeight/2;
            parent.scrollTop=trelm.offsetTop-half_window_size+40;

            trelm.classList.add('set-animation');
            setTimeout(resetAnimation, 3000, trelm);
        }
        else{
            console.log('No elements containing this id is found');
        }
    }
    else{
        window.alert("Not Found");
    }
}

function resetAnimation(trelm){
    trelm.classList.remove('set-animation');
}


// adding text to speech feature
function speak(){
    var txt=document.getElementById('randword').textContent;
    var uttr=new SpeechSynthesisUtterance(txt);
    window.speechSynthesis.speak(uttr);
}
