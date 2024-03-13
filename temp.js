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




// LOGIN
// app.post("/login", async (req, res) => {
//     try {
//         const data = await User.findOne({ fmail: req.body.fmail });
//         console.log(data.fmail)

//         if (data.fmail === req.body.fmail && data.fpass === req.body.fpass) {
//             res.send(" Login Successful");
//         } else {
//             res.send(data + "Oops...Something went wrong ");
//         }
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })