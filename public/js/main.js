$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function (response){
        alert('Deleting article');
        window.location.href='/';
      },
      error: function(err){
        console.error(err);
      }
    });
  });
});

$(document).ready(function(){
  $('.delete-user-profile').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    // console.log(name + "hello");
    $.ajax({
      type: 'DELETE',
      url: '/users/view/'+id,
      success: function (response){
          if (confirm("Press a button!")) {
            txt = "You pressed OK!";
        } else {
            txt = "You pressed Cancel!";
        }
        console.log("deleteing user called " + id);
        // alert('Deleting User Called' + id);
        window.location.href='/';
      },
      error: function(err){
        console.error(err);
      }
    });
  });
});

$(document).ready(function(){
  $('.delete-user').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: '/users/'+id,
      success: function (response){
        console.log("deleteing user called");
        alert('Deleting User');
        window.location.href='/';
      },
      error: function(err){
        console.error(err);
      }
    });
  });
});

$(document).ready(function(){
  $('.delete-dynamic').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: '/dynamics/'+id,
      success: function (response){
        alert('Deleting dynamic review');
        window.location.href='/';
      },
      error: function(err){
        console.error(err);
      }
    });
  });
});