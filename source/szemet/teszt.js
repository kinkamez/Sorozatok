firebase.database().ref('data/' + newPostKey ).transaction(function(value){
    if (value === null) {
      // the counter doesn't exist yet, start at one
      return 1;
    } else if (typeof value === 'number') {
      // increment - the normal case
      return value + 1;
    } else {
      // we can't increment non-numeric values
      console.log('The counter has a non-numeric value: ' + value)
      // letting the callback return undefined cancels the transaction
    }
  });
