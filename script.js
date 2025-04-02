const adminLogin = async () => {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
    });
    if (response.ok) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadMembers();
    } else {
        alert('Неверный логин или пароль');
    }
};

const logout = () => {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
};

const addMember = async () => {
    const name = document.getElementById('name').value;
    const telegram = document.getElementById('telegram').value;
    await fetch('/add-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, telegram })
    });
    loadMembers();
};

const loadMembers = async () => {
    const response = await fetch('/members');
    const members = await response.json();
    const list = document.getElementById('members');
    list.innerHTML = '';
    members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = `${member.name} (@${member.telegram}) `;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Удалить';
        delBtn.onclick = () => deleteMember(member.id);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
};

const deleteMember = async (id) => {
    await fetch(`/delete-member/${id}`, { method: 'DELETE' });
    loadMembers();
};
