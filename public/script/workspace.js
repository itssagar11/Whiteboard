function subMenuClose(){
    document.getElementById("sub-menu").style.display="none";
    

    }
    function subMenuOpen(){
        document.getElementById("sub-menu").style.display="inline-block";
        
    }

    
    function openLink(){
        document.getElementById("link").style.display="inline-block";
    }
    function closelink(){
        document.getElementById("link").style.display="none";
    }


    function fullscr(){
        document.querySelector('.body').requestFullscreen({ navigationUI: 'show' }).then(function() {
            document.getElementById('fullscr').style.display='none';
            document.getElementById('exitscr').style.display='inline-block';
        })
        .catch(function(error) {
            
        });
    }
    function exitfullscr(){
        if ( document.exitFullscreen) {
            document.exitFullscreen();
            document.getElementById('fullscr').style.display='inline-block';
            document.getElementById('exitscr').style.display='none';
          }
    }