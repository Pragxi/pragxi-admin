export const generateRiders = (count: number) => {
    const riders = [];
    const ghanaianFirstNames = ['Kwame', 'Ama', 'Kofi', 'Esi', 'Yaw', 'Akua', 'Kwasi', 'Adwoa', 'Yaa', 'Kwabena', 'Afia', 'Kojo', 'Abena', 'Kwaku', 'Akosua', 'Yaw', 'Ama', 'Kofi', 'Esi', 'Yaa'];
    const ghanaianLastNames = ['Asante', 'Mensah', 'Appiah', 'Agyemang', 'Boateng', 'Darko', 'Osei', 'Owusu', 'Acheampong', 'Adjei', 'Adu', 'Agyei', 'Baffour', 'Bonsu', 'Danso', 'Frimpong', 'Gyamfi', 'Kwarteng', 'Nyame', 'Sarpong'];
    const statuses = ['online', 'offline'];

    for (let i = 1; i <= count; i++) {
        const firstName = ghanaianFirstNames[Math.floor(Math.random() * ghanaianFirstNames.length)];
        const lastName = ghanaianLastNames[Math.floor(Math.random() * ghanaianLastNames.length)];
        const name = `${firstName} ${lastName}`;
        const vehicleNumber = `GHA${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
        const rating = parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1));
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const amountEarned = Math.floor(Math.random() * 1000);

        riders.push({
            id: i,
            avatar: `https://i.pravatar.cc/150?img=${i}`, // Using Pravatar for placeholder images
            name: name,
            vehicleNumber: vehicleNumber,
            rating: rating,
            status: status,
            amountEarned: amountEarned,
        });
    }

    return riders;
};