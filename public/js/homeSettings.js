// Manipulador de eventos para o botão personalizado de upload
document.getElementById('customButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

// Pegando elementos.
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

// Manipulador de eventos adicionado ao input de arquivo para exibir os nomes de arquivo
fileInput.addEventListener('change', function() {
    fileList.innerHTML = '';
    for (let i = 0; i < fileInput.files.length; i++) {
        const fileName = fileInput.files[i].name;
        const listItem = document.createElement('div');
        listItem.textContent = fileName;
        fileList.appendChild(listItem);
    }
});

// Tratando focus do ckedit
CKEDITOR.on('instanceReady', function(evt) {
    var editor = evt.editor;

    // Se clicar aparece os botoes.
    if(editor.name == "postcontent"){
        editor.on('focus', function(e) {
            var div = document.getElementById("buttons");
            div.style.display = "block";
        });

        // se sair fora apaga.
        editor.on('blur', function(e) {
            var div = document.getElementById("buttons");
            div.style.display = "none";
        });
    }
});

// Trocando o textarea dos posts 
CKEDITOR.replace('postcontent',{
    width: '97%',
    toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline']},
        { name: 'links', items: ['EmojiPanel', 'Link', 'Unlink']},
        { name: 'styles', items: ['Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
    ],
    height: 70,
    editorplaceholder: 'Diga algo aos seus amigos ou poste fotos, vídeos ou outros links!',
});

// reseta / cancela o comentario pro id do post clicado.
function resetField(id)
{
    var editor = CKEDITOR.instances['response-'+id];

    if (editor) {
        // Limpa o conteúdo do CKEditor
        editor.setData('');
        var div = document.getElementById("response-"+id);
    }
}

// Abre o comentario pro id do post clicado.
function openComment(id){
    var div = document.getElementById("c-area-"+id);
    div.classList.toggle("show-textarea");
    if(window.getComputedStyle(document.querySelector('#c-area-'+id)).display === "block") 
    { 
        // delocamento acima do textarea em pixels
        var desloc = 170;
        document.getElementById("c-area-"+id).scrollIntoView({ behavior: 'smooth' }); 
       
        // terminando rolagem
        setTimeout(function() {
            // posição atual do elemento
            var topo = document.getElementById("c-area-"+id).getBoundingClientRect().top;
            
            // Rola a pagina para cima manualmente
            document.getElementById("scroll-feed").scrollBy(0, topo - desloc);
        }, 500); // velocidade.
    }

    // substitui o textarea do comentario clicado pelo editor da api.
    CKEDITOR.replace( 'response-'+id, {
        width: '95%',
        toolbar: [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline']},
            { name: 'links', items: ['EmojiPanel', 'Link', 'Unlink']},
            { name: 'styles', items: ['Font', 'FontSize'] },
            { name: 'colors', items: ['TextColor', 'BGColor'] },
        ],
        height: 70,
        editorplaceholder: 'Faça um comentario.',
    });
}