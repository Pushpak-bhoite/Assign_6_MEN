https://source.unsplash.com/collection/190727



<li class="sidebar-item">
<a href="#" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
    data-bs-target="#auth" aria-expanded="false" aria-controls="auth">
    <i class="lni lni-protection"></i>
    <span>Auth</span>
</a>
<ul id="auth" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
    <li class="sidebar-item">
        <a href="#" class="sidebar-link">Login</a>
    </li>
    <li class="sidebar-item">
        <a href="#" class="sidebar-link">Register</a>
    </li>
</ul>
</li>

<div class="navbar nav-first ">
<!-- <div class="navbar nav-second"> -->
    <div class="navbar navbar-list">
        <ul class="list-unstyled">
            <li class="liText" style="list-style: none;"><i class="fa-solid fa-square-xmark"></i></li>


            <li class="sidebar-item">
                <a href="#" class="sidebar-link has-dropdown collapsed" data-bs-toggle="collapse"
                    data-bs-target="#product" aria-expanded="true" aria-controls="product">
                    <i class="liText fa-brands fa-product-hunt"></i>
                    <span class="liText">Product</span>
                </a>

                <ul id="product" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                <li class="sidebar-item">
                    <a href="#" class="liText sidebar-link"> Login </a>
                </li>
                <li class="sidebar-item">
                    <a href="#" class="liText sidebar-link " > Login </a>
                </li>
                </ul>
        </li>

        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
                <i class="liText fa-solid fa-location-dot"></i>
                <span class="liText" >REGION</span>
            </a>
        </li>

       
        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
                <i class="liText fa-solid fa-user"></i>
                <span class="liText" >USERS</span>
            </a>
        </li>

       
        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
                <i class="liText fa-solid fa-address-book"></i>
                <span class="liText" >CONTACT</span>
            </a>
        </li>
       
        </ul>
    </div>
</div>
</div>














@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

::after,
::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

a {
    text-decoration: none;
}

li {
    list-style: none;
}

h1 {
    font-weight: 600;
    font-size: 1.5rem;
}

body {
    font-family: 'Poppins', sans-serif;
}

.wrapper {
    display: flex;
}

.main {
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    transition: all 0.35s ease-in-out;
    background-color: #fafbfe;
}

#sidebar {
    width: 70px;
    min-width: 70px;
    z-index: 1000;
    transition: all .25s ease-in-out;
    background-color: #0e2238;
    display: flex;
    flex-direction: column;
}

#sidebar.expand {
    width: 260px;
    min-width: 260px;
}

.toggle-btn {
    background-color: transparent;
    cursor: pointer;
    border: 0;
    padding: 1rem 1.5rem;
}

.toggle-btn i {
    font-size: 1.5rem;
    color: #FFF;
}

.sidebar-logo {
    margin: auto 0;
}

.sidebar-logo a {
    color: #FFF;
    font-size: 1.15rem;
    font-weight: 600;
}

#sidebar:not(.expand) .sidebar-logo,
#sidebar:not(.expand) a.sidebar-link span {
    display: none;
}

.sidebar-nav {
    padding: 2rem 0;
    flex: 1 1 auto;
}

a.sidebar-link {
    padding: .625rem 1.625rem;
    color: #FFF;
    display: block;
    font-size: 0.9rem;
    white-space: nowrap;
    border-left: 3px solid transparent;
}

.sidebar-link i {
    font-size: 1.1rem;
    margin-right: .75rem;
}

a.sidebar-link:hover {
    background-color: rgba(255, 255, 255, .075);
    border-left: 3px solid #3b7ddd;
}

.sidebar-item {
    position: relative;
}

#sidebar:not(.expand) .sidebar-item .sidebar-dropdown {
    position: absolute;
    top: 0;
    left: 70px;
    background-color: #0e2238;
    padding: 0;
    min-width: 15rem;
    display: none;
}

#sidebar:not(.expand) .sidebar-item:hover .has-dropdown+.sidebar-dropdown {
    display: block;
    max-height: 15em;
    width: 100%;
    opacity: 1;
}

#sidebar.expand .sidebar-link[data-bs-toggle="collapse"]::after {
    border: solid;
    border-width: 0 .075rem .075rem 0;
    content: "";
    display: inline-block;
    padding: 2px;
    position: absolute;
    right: 1.5rem;
    top: 1.4rem;
    transform: rotate(-135deg);
    transition: all .2s ease-out;
}

#sidebar.expand .sidebar-link[data-bs-toggle="collapse"].collapsed::after {
    transform: rotate(45deg);
    transition: all .2s ease-out;
}














<script>
        const open_menu = document.querySelector('.fa-bars')
        const close_menu = document.querySelector('.fa-square-xmark')
        const nav_active = document.querySelectorAll('.navbar');
        console.log(nav_active);

        open_menu.addEventListener('click', () => {
            nav_active.forEach((elem) => {
                elem.classList.add('active');
            });
        });
        close_menu.addEventListener('click', () => {
            nav_active.forEach((elem) => {
                elem.classList.remove('active');
            });
        });
    </script>