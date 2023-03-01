import { requestGetloggedUser, requestCreateNewPost, requestGetAllPosts, requestUpdatePost, requestDeletePost } from './request.js';

let arrayAllPosts = [];

function authentication() {
    const token = localStorage.getItem('@petInfoToken:token')

    if (!token) {
        window.location.replace('../../index.html')
    }
};

// POST
function renderModalCreatePost() {
    let modalTag = document.querySelector('#modalControl-createPost');
    let containerModal = document.createElement('form');
    let containerHeaderModal = document.createElement('div');
    let titleHeaderModal = document.createElement('h1');
    let closeImg = document.createElement('img');
    let containerMainModal = document.createElement('div');
    let containerMainInputTitle = document.createElement('div');
    let tagTitle = document.createElement('label');
    let inputTitle = document.createElement('input');
    let containerMainInputContent = document.createElement('div');
    let tagContent = document.createElement('label');
    let inputContent = document.createElement('input');
    let containerButtons = document.createElement('div');
    let cancelButton = document.createElement('button');
    let buttonPublish = document.createElement('button');

    containerModal.setAttribute('class', 'modalCreatePost__container');
    containerHeaderModal.setAttribute('class', 'modalCreatePost__header');
    titleHeaderModal.innerText = 'Criando novo post';
    closeImg.src = '../assets/img/FecharModal.svg';
    closeImg.alt = 'X-icon';
    containerMainModal.setAttribute('class', 'modalCreatePost__main');

    containerMainInputTitle.setAttribute('class', 'modalCreatePost__inputs');
    tagTitle.for = 'title';
    tagTitle.innerText = 'Título do Post'
    inputTitle.setAttribute('class', 'modalCreatePost__inputPost');
    inputTitle.type = 'text';
    inputTitle.name = 'title';
    inputTitle.id = 'title';
    inputTitle.placeholder = 'Digite o título aqui...';

    containerMainInputContent.setAttribute('class', 'modalCreatePost__inputs');
    tagContent.for = 'content';
    tagContent.innerText = 'Conteúdo do Post';
    inputContent.setAttribute('class', 'modalCreatePost__inputPost');
    inputContent.type = 'text';
    inputContent.name = 'content';
    inputContent.id = 'content';
    inputContent.placeholder = 'Desenvolva o conteúdo do post aqui...';

    containerButtons.setAttribute('class', 'modalCreatePost__buttons');
    cancelButton.setAttribute('class', 'modalCreatePost__buttons--cancel')
    cancelButton.type = 'submit';
    cancelButton.innerText = 'Cancelar';
    buttonPublish.setAttribute('class', 'modalCreatePost__buttons--publish');
    buttonPublish.type = 'submit';
    buttonPublish.innerText = 'Publicar';

    containerModal.append(containerHeaderModal, containerMainModal, containerButtons);
    containerHeaderModal.append(titleHeaderModal, closeImg);
    containerMainModal.append(containerMainInputTitle, containerMainInputContent);
    containerMainInputTitle.append(tagTitle, inputTitle);
    containerMainInputContent.append(tagContent, inputContent);
    containerButtons.append(cancelButton, buttonPublish);
    modalTag.appendChild(containerModal);

    return modalTag;
};

function addEventOpenModalCreatePost() {
    const modal = document.querySelector('#modalControl-createPost');
    const buttonCreatePost = document.querySelector('.nav__buttonCreatePost');

    buttonCreatePost.addEventListener('click', () => {
        modal.showModal();
    });
};

function addEventCloseModalCreatePost() {
    let modal = document.querySelector('#modalControl-createPost');
    let buttonCloseModal = document.querySelector('.modalCreatePost__header>img');
    let buttonCancel = document.querySelector('.modalCreatePost__buttons');

    buttonCloseModal.addEventListener('click', () => {
        modal.close();
    });

    buttonCancel.addEventListener('click', () => {
        modal.close();
    });
};

function handleNewPost() {
    const inputsModalPost = document.querySelectorAll('.modalCreatePost__inputPost');
    const buttonPublish = document.querySelector('.modalCreatePost__buttons--publish');
    const createPostBody = {};
    let count = 0;

    buttonPublish.addEventListener('click', async (event) => {
        event.preventDefault();

        inputsModalPost.forEach((input) => {
            if (input.value === '') {
                count++;
            }
            createPostBody[input.name] = input.value;
        });

        if (count !== 0) {
            return alert('Por favor preencha todos os campos antes de publicar');
        } else {
            const post = await requestCreateNewPost(createPostBody);

            arrayAllPosts.push(post);
            renderArrAllPosts(arrayAllPosts);

            return post;
        }
    });
};

async function getAllPostsFromServer() {
    arrayAllPosts = await requestGetAllPosts();

    renderArrAllPosts(arrayAllPosts);
};

function renderArrAllPosts(array) {
    let listPosts = document.querySelector('.post__container');

    listPosts.innerHTML = ''; //Limpar minha ul-list

    array.forEach((post) => {
        let itemPost = createCardPost(post);

        listPosts.appendChild(itemPost);
    });

    return listPosts;
};

function createCardPost(post) {
    let listPost = document.createElement('li');
    let containerPostUser = document.createElement('div');
    let containerUser = document.createElement('div');
    let imageUser = document.createElement('img');
    let nameUser = document.createElement('p');
    let dataPost = document.createElement('small');
    let containerUserButtons = document.createElement('div');
    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let postContainer = document.createElement('div');
    let postTitle = document.createElement('h1');
    let contentPost = document.createElement('p');
    let containerShowPost = document.createElement('div');
    let buttonShowPost = document.createElement('button');

    listPost.id = `post_${post.id}`;
    listPost.setAttribute('class', 'main__post');
    containerPostUser.setAttribute('class', 'main__postUser');
    containerUser.setAttribute('class', 'main__postUser--user');
    imageUser.src = post.user.avatar;
    imageUser.alt = 'User Photo'
    nameUser.innerText = post.user.username;
    dataPost.setAttribute('class', 'main__postUser--data');
    dataPost.innerText = new Date(post.createdAt).toLocaleDateString();

    containerUserButtons.setAttribute('class', 'main__postUser--buttons');
    editButton.setAttribute('class', 'main__postUser--edit');
    editButton.innerText = 'Editar';
    deleteButton.setAttribute('class', 'main__postUser--delete');
    deleteButton.innerHTML = 'Excluir';
    postContainer.setAttribute('class', 'main__postContent');
    postTitle.innerText = post.title;

    let cutContentPost = post.content.indexOf('.');

    if (cutContentPost === -1) {  //Caso não encontra o (.)
        cutContentPost = post.content.length;
    };

    contentPost.innerText = `${post.content.substring(0, cutContentPost)}...`;
    containerShowPost.setAttribute('class', 'main__post--buttonModal');
    buttonShowPost.id = `showModal_${post.id}`;
    buttonShowPost.innerText = 'Acessar publicação'

    listPost.append(containerPostUser, postContainer, containerShowPost);
    containerPostUser.append(containerUser, containerUserButtons);
    containerUser.append(imageUser, nameUser, dataPost);
    containerUserButtons.append(editButton, deleteButton);
    postContainer.append(postTitle, contentPost);
    containerShowPost.appendChild(buttonShowPost);

    // createImageUserLogged(post);
    addEventButtonOpenPost(buttonShowPost, post); //Evento button showModal;
    addEventButtonEditPost(editButton, post); //Evento button Editar;
    addEventButtonDeletePost(deleteButton, post); //Evento button Excluir;
    authenticateLoggedUser(post);
    return listPost;
};

// USER
function createImageUserLogged(post) {
    const navContainer = document.querySelector('.nav__container');
    const userImage = document.createElement('img');

    userImage.setAttribute('class', 'nav__userImage');
    userImage.src = post.user.avatar;
    userImage.alt = 'Photo User';

    navContainer.appendChild(userImage);
    return navContainer;
};

// PATCH
function renderModalPost() {
    let modal = document.querySelector('#modalControl-showPost');
    let containerModal = document.createElement('div');
    let headerContainer = document.createElement('div');
    let containerUser = document.createElement('div');
    let userPhoto = document.createElement('img');
    let userName = document.createElement('p');
    let postDate = document.createElement('small');
    let buttonCloseModal = document.createElement('img');
    let containerContentPost = document.createElement('div');
    let titlePost = document.createElement('h1');
    let textPost = document.createElement('p');

    containerModal.setAttribute('class', 'modalShowPost__container');
    headerContainer.setAttribute('class', 'modalShowPost__user');
    containerUser.setAttribute('class', 'modalShowPost__user--user');
    userPhoto.setAttribute('class', 'modalShowPost__avatar');
    userPhoto.alt = 'userPhoto';
    userName.setAttribute('class', 'modalShowPost__username');
    postDate.setAttribute('class', 'modalShowPost__createdAt');

    buttonCloseModal.setAttribute('class', 'closeModalPost');
    buttonCloseModal.src = '../assets/img/FecharModal.svg';
    buttonCloseModal.alt = 'X-icon';

    containerContentPost.setAttribute('class', 'modalShowPost__postContent');
    titlePost.setAttribute('class', 'modalShowPost__title');
    textPost.setAttribute('class', 'modalShowPost__content');

    modal.appendChild(containerModal);
    containerModal.append(headerContainer, containerContentPost);
    headerContainer.append(containerUser, buttonCloseModal);
    containerUser.append(userPhoto, userName, postDate);
    containerContentPost.append(titlePost, textPost);

    addEventCloseModalPost();     // Fechando o modal
    return modal;
};

function addEventButtonOpenPost(buttonOpenModal, post) {

    buttonOpenModal.addEventListener('click', () => {
        OpenModalPost(post); //Chamando a função abrir modal
    });
};

function OpenModalPost(post) {
    updateModalPost(post); //Chamando função que renderiza post conforme click.

    let modal = document.querySelector('#modalControl-showPost');
    modal.showModal(); //Abrindo o modal
};

function updateModalPost(post) {
    let userPhoto = document.querySelector('.modalShowPost__avatar');
    let userName = document.querySelector('.modalShowPost__username');
    let postDate = document.querySelector('.modalShowPost__createdAt');
    let modalTitle = document.querySelector('.modalShowPost__title');
    let modalPost = document.querySelector('.modalShowPost__content');

    userPhoto.src = post.user.avatar;
    userPhoto.alt = post.user.username;
    userName.innerText = post.user.username;
    postDate.innerText = new Date(post.createdAt).toLocaleDateString();
    modalTitle.innerText = post.title;
    modalPost.innerText = post.content;

    // console.log(post);
    // console.log(postDate);
};

function addEventCloseModalPost() {
    let modal = document.querySelector('#modalControl-showPost');
    let buttonCloseModal = document.querySelector('.closeModalPost');

    buttonCloseModal.addEventListener('click', (event) => {
        modal.close();
    });
};

function renderModalEditPost() {
    const modalEditPost = document.querySelector('#modalControl-patchPost');
    let containerModal = document.createElement('form');
    let containerHeaderModal = document.createElement('div');
    let titleForm = document.createElement('h3');
    let closeModalEditPost = document.createElement('img');
    let containerContentModal = document.createElement('div');
    let tagTitle = document.createElement('label');
    let inputTitle = document.createElement('input');
    let tagContent = document.createElement('label');
    let areaContent = document.createElement('textarea');
    let containerButtons = document.createElement('div');
    let cancelButton = document.createElement('button');
    let buttonSave = document.createElement('button');

    containerModal.setAttribute('class', 'modalPatchPost__container');
    containerHeaderModal.setAttribute('class', 'modalPatchPost__header');
    titleForm.innerText = 'Edição';
    closeModalEditPost.setAttribute('class', 'modalPatchPost__closeEditPost');
    closeModalEditPost.src = '../assets/img/FecharModal.svg';
    closeModalEditPost.alt = 'Button X';
    containerContentModal.setAttribute('class', 'modalPatchPost__postContent');
    tagTitle.for = 'title';
    tagTitle.innerText = 'Título do Post';
    inputTitle.setAttribute('class', 'edit__input');
    inputTitle.type = 'text';
    inputTitle.name = 'title';
    inputTitle.id = 'title';
    tagContent.for = 'content';
    tagContent.innerHTML = 'Conteúdo do post';
    areaContent.setAttribute('class', 'edit__textarea');
    areaContent.name = 'content';
    areaContent.id = 'content';
    containerButtons.setAttribute('class', 'modalPatchPost__buttons');
    cancelButton.setAttribute('class', 'modalPatchPost__buttons--calcel');
    cancelButton.type = 'submit';
    cancelButton.innerText = 'Cancelar';
    buttonSave.setAttribute('class', 'modalPatchPost__buttons--toSave');
    buttonSave.type = 'submit';
    buttonSave.innerText = 'Salvar alterações';

    modalEditPost.appendChild(containerModal);
    containerModal.append(containerHeaderModal, containerContentModal, containerButtons);
    containerHeaderModal.append(titleForm, closeModalEditPost);
    containerContentModal.append(tagTitle, inputTitle, tagContent, areaContent);
    containerButtons.append(cancelButton, buttonSave);

    addEventCloseModalFormEditPost();
    return modalEditPost;
};

function addEventButtonEditPost(buttonOpenModal, post) {
    buttonOpenModal.addEventListener('click', (event) => {
        event.preventDefault();
        OpenModalFormEditPost(post); //Chamando a função abrir modal
    });
};

function OpenModalFormEditPost(post) {
    updateModalFormEditPost(post); //Chamando função que renderiza post conforme click.

    let modal = document.querySelector('#modalControl-patchPost');
    modal.showModal(); //Abrindo o modal
};

function updateModalFormEditPost(post) {
    let inputTitle = document.querySelector('.edit__input');
    let textareaContent = document.querySelector('.edit__textarea');

    inputTitle.value = post.title;
    textareaContent.innerText = post.content;
    // console.dir(inputTitle);

    handleUpdatePost(post);
};

const handleUpdatePost = (post) => {
    const titlePostInput = document.querySelector('.edit__input');
    const contentPostTextarea = document.querySelector('.edit__textarea');
    const buttonSave = document.querySelector('.modalPatchPost__buttons--toSave');
    const updatePostBody = {};
    if (post) {
        const postId = post.id;

        buttonSave.addEventListener('click', async (event) => {
            event.preventDefault();

            if (titlePostInput.value !== '') {
                updatePostBody.title = titlePostInput.value;
            }
            if (contentPostTextarea.value !== '') {
                updatePostBody.content = contentPostTextarea.value;
            }
            await requestUpdatePost(postId, updatePostBody);
            await getAllPostsFromServer(arrayAllPosts);
        });
    }
};

function addEventCloseModalFormEditPost() {
    let modal = document.querySelector('#modalControl-patchPost');
    let buttonCloseModal = document.querySelector('.modalPatchPost__closeEditPost');
    let buttonSave = document.querySelector('.modalPatchPost__buttons--toSave');

    buttonCloseModal.addEventListener('click', (event) => {
        modal.close();
    });
    buttonSave.addEventListener('click', (event) => {
        modal.close();
    })
};

// DELETE
function renderModalDeletePost() {
    const modalDeletePost = document.querySelector('#modalControl-deletePost');
    const formContainer = document.createElement('form');
    const headerContainer = document.createElement('div');
    const headerTitle = document.createElement('h2');
    const buttonCloseModal = document.createElement('img');
    const titleAlert = document.createElement('h1');
    const contentAlert = document.createElement('p');
    const buttonsContainer = document.createElement('div');
    const buttonCancel = document.createElement('button');
    const buttonConfirmDelete = document.createElement('button');

    formContainer.setAttribute('class', 'modalDeletePost__container');
    headerContainer.setAttribute('class', 'modalDeletePost__header');
    buttonCloseModal.setAttribute('class', 'modalDeletePost__imgClose');
    buttonCloseModal.src = '../assets/img/FecharModal.svg';
    buttonCloseModal.alt = 'Button X';
    buttonsContainer.setAttribute('class', 'modalDeletePost__buttons');
    buttonCancel.type = 'submit';
    buttonCancel.innerText = 'Cancelar';
    buttonConfirmDelete.id = 'modalDeletePost__confirmeDelete';
    buttonConfirmDelete.type = 'submit';
    buttonConfirmDelete.innerHTML = 'Sim, excluir este post';

    modalDeletePost.appendChild(formContainer);
    formContainer.append(headerContainer, titleAlert, contentAlert, buttonsContainer)
    headerContainer.append(headerTitle, buttonCloseModal);
    buttonsContainer.append(buttonCancel, buttonConfirmDelete);

    addEventCloseModal();
    return modalDeletePost;
};

function addEventButtonDeletePost(deleteButton, post) {
    deleteButton.addEventListener('click', () => {
        openModalDelete(post);
    });
};

function openModalDelete(post) {
    handleDeletePost(post);
    let modal = document.querySelector('#modalControl-deletePost');
    modal.showModal(); //Abrindo o modal
};

const handleDeletePost = (post) => {
    if (post) {
        const postId = post.id;
        const buttonDelete = document.querySelector('#modalDeletePost__confirmeDelete');

        buttonDelete.addEventListener('click', async (event) => {
            event.preventDefault();
            await requestDeletePost(postId);

            arrayAllPosts = arrayAllPosts.filter(post => post.id !== postId);
            renderArrAllPosts(arrayAllPosts);
        });
    };
};

function addEventCloseModal() {
    let modal = document.querySelector('#modalControl-deletePost');
    let buttonCloseModal = document.querySelector('.modalDeletePost__imgClose');
    let buttonConfirmDelete = document.querySelector('#modalDeletePost__confirmeDelete')

    buttonCloseModal.addEventListener('click', (event) => {
        event.preventDefault();
        modal.close();
    });

    buttonConfirmDelete.addEventListener('click', (event) => {
        event.preventDefault();
        modal.close();
    });
};

// 
async function getUserDataLogged() {
    const user = await requestGetloggedUser();
    console.log(user);
    return user;
};

async function authenticateLoggedUser(post) {
    const user = await getUserDataLogged();
    const containerButtonsEditAndDelete = document.querySelector('.main__postUser--buttons');
    if (user.id !== post.user.id) {
        containerButtonsEditAndDelete.style.display = 'none';
    };
};

// authentication();
renderModalCreatePost();
addEventOpenModalCreatePost();
addEventCloseModalCreatePost();
handleNewPost();
getAllPostsFromServer();
renderModalPost();
renderModalEditPost();
handleUpdatePost();
renderModalDeletePost();


