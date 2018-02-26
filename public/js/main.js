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
  $('.delete-user').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: '/users/'+id,
      success: function (response){
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