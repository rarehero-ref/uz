document.addEventListener('DOMContentLoaded', () => {
    const userDisplay = document.getElementById('user-display');
    const nftGrid = document.getElementById('nft-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const closeAppBtn = document.getElementById('close-app-btn');

    // Telegram Web App obyekti mavjudligini tekshirish
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Web App tayyorligini Telegramga bildiramiz
        webApp.ready();
        // Web App ni to'liq ekranga yoyamiz
        webApp.expand();
        // Main Buttonni sozlash (agar kerak bo'lsa)
        // webApp.MainButton.setText("NFT sotib olish").show();

        // Foydalanuvchi ma'lumotlarini olish va ko'rsatish
        if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
            const user = webApp.initDataUnsafe.user;
            const userName = user.first_name || 'Noma\'lum Foydalanuvchi';
            userDisplay.innerText = `Foydalanuvchi: ${userName} (ID: ${user.id})`;

            // Agar user info main buttonga joylamoqchi bo'lsangiz
            // webApp.MainButton.onClick(() => {
            //    webApp.showAlert(`Salom, ${userName}!`);
            // });
        } else {
            userDisplay.innerText = "Foydalanuvchi ma'lumotlari mavjud emas.";
            // webApp.MainButton.hide(); // Agar main buttonni yashirmoqchi bo'lsangiz
        }

        // Ilovani yopish tugmasi
        closeAppBtn.addEventListener('click', () => {
            webApp.close(); // Telegram Web App ni yopish
        });

        // Backenddan NFT ma'lumotlarini olish uchun soxta ma'lumotlar
        let currentNfts = 0;
        const totalNfts = 15; // Jami NFTlar soni (soxta)

        function generateFakeNfts(count) {
            const nfts = [];
            for (let i = 0; i < count; i++) {
                currentNfts++;
                nfts.push({
                    id: currentNfts,
                    name: `Crypto Art #${currentNfts}`,
                    description: `Ushbu noyob raqamli san'at asari ${currentNfts}.`,
                    image: `https://via.placeholder.com/250x250/00bcd4/FFFFFF?text=NFT+${currentNfts}`, // Placeholder rasmlar
                    price: `${(Math.random() * 2 + 0.1).toFixed(2)} ETH` // Tasodifiy narx
                });
            }
            return nfts;
        }

        // NFTlarni sahifaga yuklash funksiyasi
        function renderNfts(nfts) {
            nfts.forEach(nft => {
                const nftItem = document.createElement('div');
                nftItem.classList.add('nft-item');
                nftItem.innerHTML = `
                    <img src="${nft.image}" alt="${nft.name}">
                    <h3>${nft.name}</h3>
                    <p>${nft.description}</p>
                    <p class="price">${nft.price}</p>
                `;
                // Har bir NFT bosilganda
                nftItem.addEventListener('click', () => {
                    webApp.showAlert(`Siz "${nft.name}" NFT'sini tanladingiz. Narxi: ${nft.price}`);
                    // webApp.openTelegramLink('https://t.me/your_bot?startapp=buy_nft_' + nft.id); // NFT sotib olish uchun botga yo'naltirish
                });
                nftGrid.appendChild(nftItem);
            });
        }

        // Dastlabki NFTlarni yuklash
        renderNfts(generateFakeNfts(6)); // Sahifaga 6 ta NFT yuklaymiz

        // "Ko'proq yuklash" tugmasi hodisasi
        loadMoreBtn.addEventListener('click', () => {
            if (currentNfts < totalNfts) {
                renderNfts(generateFakeNfts(3)); // Yana 3 ta NFT yuklaymiz
                if (currentNfts >= totalNfts) {
                    loadMoreBtn.innerText = "Barcha NFTlar yuklandi";
                    loadMoreBtn.disabled = true; // Tugmani o'chirish
                    webApp.showNotification({ message: "Barcha NFTlar yuklandi!", type: 'success' });
                }
            } else {
                webApp.showNotification({ message: "Yuklanadigan boshqa NFT yo'q.", type: 'info' });
            }
        });

    } else {
        // Agar Web App Telegram ichida ochilmasa (brauzerda test qilish uchun)
        userDisplay.innerText = "Ilova Telegram Web App muhitida emas. Ba'zi funksiyalar cheklangan.";
        closeAppBtn.style.display = 'none';

        // Brauzer test uchun soxta NFTlar
        let browserNfts = [
            { id: 1, name: "Test NFT #1", description: "Brauzer uchun test NFT.", image: "https://via.placeholder.com/250x250/FF6347/FFFFFF?text=Test+NFT1", price: "0.01 BTC" },
            { id: 2, name: "Test NFT #2", description: "Brauzer uchun test NFT.", image: "https://via.placeholder.com/250x250/4682B4/FFFFFF?text=Test+NFT2", price: "0.02 BTC" },
            { id: 3, name: "Test NFT #3", description: "Brauzer uchun test NFT.", image: "https://via.placeholder.com/250x250/DAA520/FFFFFF?text=Test+NFT3", price: "0.03 BTC" },
        ];

        function renderBrowserNfts(nfts) {
            nfts.forEach(nft => {
                const nftItem = document.createElement('div');
                nftItem.classList.add('nft-item');
                nftItem.innerHTML = `
                    <img src="${nft.image}" alt="${nft.name}">
                    <h3>${nft.name}</h3>
                    <p>${nft.description}</p>
                    <p class="price">${nft.price}</p>
                `;
                nftItem.addEventListener('click', () => {
                    alert(`Siz "${nft.name}" NFT'sini tanladingiz. Narxi: ${nft.price} (Brauzer rejimi)`);
                });
                nftGrid.appendChild(nftItem);
            });
        }
        renderBrowserNfts(browserNfts);

        loadMoreBtn.addEventListener('click', () => {
            renderBrowserNfts(browserNfts); // Brauzerda test uchun yana yuklash
            alert("Ko'proq NFT yuklandi (Brauzer rejimi).");
        });
    }
});
