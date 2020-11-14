const hamburgerMenu = document.querySelector('.nav__hamburgerMenu');
const mobileNavItems = document.querySelector('.nav__items');
const profileAvatar = document.querySelector('.avatarImage');
const profileName = document.querySelector('.profile__name');
const profileLogin = document.querySelector('.profile__login');
const profileBio = document.querySelector('.profile__bio');
const repoCount = document.querySelectorAll('.repo__count');
const reposContainer = document.querySelector('.profile__repos');
const repos = document.querySelector('.profile__repos');
const reposCount = document.querySelector('.publicRepos__count');

// Toggle mobile nav items
hamburgerMenu.addEventListener('click', () => {
  mobileNavItems.classList.toggle('hide')
})

// Data fetching
const githubProfileQuery = `
  {
    viewer {
      name
      login
      bio
      avatarUrl
      repositories (first: 20, orderBy: {field:CREATED_AT, direction: DESC}) {
        totalCount
        edges {
          node {
            name
            description
            forkCount
            isPrivate
            stargazerCount
            updatedAt
            languages(first: 1) {
              edges {
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  }
`;
const token = "99a8e74b7c168ee24ab56cbb7a4ebbe3b6f8af88";
const url = "https://api.github.com/graphql";

// fetch options
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    query: githubProfileQuery
  })
};

function fetchGithubData() {
  return fetch(url, options)
  .then(res => res.json())
  .then(res => res.data)
}

async function loadData() {
  const data = await fetchGithubData();

  const {
    viewer: { 
      name,
      avatarUrl, 
      bio, 
      login, 
      repositories: {edges, totalCount},
    }
  } = data;

  profileAvatar.src=`${avatarUrl}`;
  profileBio.textContent = `${bio}`;
  profileLogin.textContent = `${login}`;
  profileName.textContent = `${name}`;
  repoCount.forEach(repoNode => repoNode.textContent = `${totalCount}`); 

  const publicReposCount = edges.filter(({node}) => !node.isPrivate).length;
  reposCount.innerHTML = `
    <strong>${publicReposCount}</strong> results found for <strong>public</strong> repositories`;
  
  const wrapper = document.createElement('div');

  edges.map(({node}) => {
    const {
      description,
      forkCount,
      languages,
      name,
      stargazerCount,
      updatedAt,
    } = node;

    const langName = languages.edges[0]?.node?.name;
    const langColor = languages.edges[0]?.node?.color;
    const date = formatDate(updatedAt);

    wrapper.innerHTML += `
      <div class="profile__repo">
        <div class="repo__info">
          <div class="repo__name">
            <a href="#">
              <h3>${name}</h3>
            </a>
          </div>
          <div class="repo__description">
            <p>${description ? description : ''}</p>
          </div>
          <div class="repo__details">
            ${repoLangNode(langName, langColor)}
            
            <div class="stars flex-center">
              <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" stroke="#E1E4E8"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
              <span class="lang_name">${stargazerCount}</span>
              </div>

            <div class="fork flex-center">
                <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img" stroke="#E1E4E8"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
              <span class="fork_count">${forkCount}</span>
            </div>
            <div class="repoUpdatedAt">
              <span>Updated ${date > 1 ? date + ' days' : date + ' day'} ago</span>
            </div>
          </div>
        </div>

        <div class="starButtonWrapper">
          <button>
            <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
            Star
          </button>
        </div>
      </div>
    `;

    repos.appendChild(wrapper);
  });
}

// laad github data
loadData();

// format date to show days
function formatDate(date) {
  const dateDiff = new Date().getTime() - new Date(date).getTime();
  const days = dateDiff / (1000 * 3600 * 24);
  return Math.floor(days);
}

// show the the repo language node if the lang exists
function repoLangNode(langName, langColor) {
  if (!langName ) {
    return ''
  }
  return ` 
    <div class="repo__lang">
      <span class="lang__color" style="background: ${langColor}"></span>
      <span class="lang__name">${langName || ''}</span>
    </div>`
}