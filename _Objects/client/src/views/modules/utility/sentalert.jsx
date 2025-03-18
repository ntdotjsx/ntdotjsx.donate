import Swal from 'sweetalert2';

export const showConfirmationDialog = async (logout) => {
    const result = await Swal.fire({
        html: `
            <div>
                <div class="relative w-[100vw] sm:w-[450px] p-6 bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-lg text-gray-800">
                    <button id="CancelLogout" class="absolute top-4 right-6 w-[40px] h-[40px] text-xl rounded-xl transition duration-300 hover:bg-gray-200">
                        <i class="fal fa-times"></i>
                    </button>
                    <a class="relative text-gray-800 block w-fit text-xs px-4 py-0.5 bg-gray-100 rounded-full mb-4">Confirm Logout</a>
                    <h1 class="relative text-3xl font-semibold mb-3 text-left">ยืนยันออกจากระบบ</h1>
                    <p class="text-left mb-3">โปรดกดปุ่มยืนยันเพื่อลงชื่อ <span style='color:red;'>ออกจากระบบ</span></p>
                    <button id="ConfirmLogout" class="relative w-full bg-gray-800 text-white p-3 rounded-xl transition duration-300 hover:bg-gray-700">ยืนยันและออกจากระบบ</button>
                </div>
            </div>
        `,
        showCancelButton: false,
        background: 'none',
        showConfirmButton: false,
        backdrop: '#ffffff80',
        focusConfirm: false,
        willOpen: () => {
            const ConfirmLogout = document.getElementById('ConfirmLogout');
            const CancelLogout = document.getElementById('CancelLogout');

            CancelLogout.onclick = () => {
                console.log('Logout Cancelled');
                Swal.close();
            };

            ConfirmLogout.onclick = async () => {
                console.log('Logout submitted');
                await logout();
                Swal.close();
            };
        },
        customClass: {
            popup: 'max-w-lg',
        },
    });
};

const mixinAlert = Swal.mixin({
    toast: true,
    background: 'none',
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const showToast = (icon, title) => {
    const contentSuccess = `
        <div class="flex items-center p-4 bg-white border border-green-300 rounded-2xl shadow-lg text-gray-800">
            <i class="fas fa-check-circle text-green-500 text-2xl mr-4"></i>
            <div>
                <p>${title}</p>
            </div>
        </div>
    `;

    const contentError = `
        <div class="flex items-center p-4 bg-white border border-red-300 rounded-2xl shadow-lg text-gray-800">
            <i class="fas fa-exclamation-circle text-red-500 text-2xl mr-4"></i>
            <div>
                <p>${title}</p>
            </div>
        </div>
    `;

    let final;

    if (icon === 'success') {
        final = contentSuccess;
    } else {
        final = contentError;
    }

    mixinAlert.fire({
        html: final,
    });
};


export function sentAlert(title, text, type) {
    Swal.fire({
        html:`
            <div>
                <div class="relative w-[100vw] sm:w-[450px] p-6 bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-lg text-gray-800">
                    <h1 class="relative text-3xl font-semibold mb-3 text-left">${title}</h1>
                    <p class="text-left mb-3">${text}</p>
                    <button id="ConfirmLogout" class="relative w-full bg-gray-800 text-white p-3 rounded-xl transition duration-300 hover:bg-gray-700">Confirm</button>
                </div>
            </div>
        `,
        showConfirmButton: false,
        background: 'none',
    });
}
