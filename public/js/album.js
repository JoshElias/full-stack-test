function status(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function deleteAlbum(albumId) {
    fetch(
        '/' + albumId + '/delete', 
        {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: JSON.stringify({albumId}),
            credentials: 'include',
            mode: 'cors'
        }
    )
    .then( status )
    .then( response => response.json())
    .then( res => {
        document.querySelector("#album_" + albumId).remove();
    })
    .catch( err =>
        {console.log("Error:", err);}
    );
}