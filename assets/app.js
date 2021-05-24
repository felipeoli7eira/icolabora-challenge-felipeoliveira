export default class App
{
    constructor()
    {
        this.state = {
            api: "https://api.github.com",

            currentUser: {},
            users: []
        }
    }

    async getUserDataFromGithubAPI(userName)
    {
        return await $.get(`${this.state.api}/users/${userName}`, (response) => response)
    }

    userPreview(user)
    {
        this.state.currentUser = user

        let componentUserPreview = $('.user-preview')
        let componentUserSearch  = $('.user-search')


        let photo    = $('.preview--user-avatar-info')
        let name     = $('.preview--user-name-info')
        let bio      = $('.preview--user-bio-info')
        let location = $('.preview--user-location-info')

        photo.attr('src', user.avatar_url)
        name.html(user.name)
        bio.html(user.bio)
        location.html(user.location)

        if (componentUserPreview.hasClass('d-none')) {
            componentUserPreview.removeClass('d-none')
        }

        if (!componentUserSearch.hasClass('d-none')) {
            componentUserSearch.addClass('d-none')
        }
    }

    cancelSearchResult()
    {
        let componentUserPreview = $('.user-preview')
        let componentUserSearch  = $('.user-search')

        if (!componentUserPreview.hasClass('d-none')) {
            componentUserPreview.addClass('d-none')
        }

        if (componentUserSearch.hasClass('d-none')) {
            componentUserSearch.removeClass('d-none')
        }

        this.state.currentUser = {}
    }

    save()
    {
        let componentUserPreview =$('.user-preview')
        let componentUserSearch = $('.user-search')

        this.state.users.push(
            {
                id: this.state.currentUser.id,
                photo: this.state.currentUser.avatar_url,
                name: this.state.currentUser.name,
                bio: this.state.currentUser.bio,
                location: this.state.currentUser.location
            }
        )

        if (!componentUserPreview.hasClass('d-none')) {
            componentUserPreview.addClass('d-none')
        }

        if (componentUserSearch.hasClass('d-none')) {
            componentUserSearch.removeClass('d-none')
        }

        this.state.currentUser = {}

        $('input[name=search_user_name]').val('')
        $('input[name=search_user_name]').focus()
    }

    updateTableList()
    {
        let table = $('.users-table tbody')

        table.html('')

        this.state.users.forEach (user => {
            let row = `<tr data-row="${user.id}">
                <td>${user.name}</td>
                <td>${user.bio || '...'}</td>
                <td>${user.location || '...'}</td>
                <td>
                    <button class="show-user-info btn btn-primary btn-sm" data-id="${user.id}">visualizar</button>
                </td>
            </tr>`

            table.append(row)
        })

        Array.from($('button.show-user-info')).forEach(button => {
            button.onclick = (event) => this.showUserInfo(event)
        } )
    }

    showUserInfo({target})
    {
        let user = Array.from(this.state.users).filter(
            user => user.id === parseInt(target.dataset.id)
        ) [ 0 ]

        if ($('.user-edit').hasClass('d-none')) {
            $('.user-edit').removeClass('d-none')
        }

        if (!$('.user-search').hasClass('d-none')) {
            $('.user-search').addClass('d-none')
        }

        $('img.edit--user-avatar')            .attr('src', user.photo)
        $('input[name=edit--user-name]')      .val(user.name)
        $('input[name=edit--user-bio]')       .val(user.bio)
        $('input[name=edit--user-location]')  .val(user.location)
        $('button.btn-delete-user')  .attr('data-userid', user.id)
        $('button.btn-update-user')    .attr('data-userid', user.id)
    }

    delete(user)
    {
        this.state.users.forEach((userObject, index) => {
            if (userObject.id == user) {
                this.state.users.splice(index, 1)
            }
        })

        if (!$('.user-edit').hasClass('d-none')) {
            $('.user-edit').addClass('d-none')
        }

        if ($('.user-search').hasClass('d-none')) {
            $('.user-search').removeClass('d-none')
        }

        $('img.edit--user-avatar')            .attr('src', '')
        $('input[name=edit--user-name]')      .val('')
        $('input[name=edit--user-bio]')       .val('')
        $('input[name=edit--user-location]')  .val('')
        $('button.btn-delete-user')  .attr('data-userid', '#')
        $('button.btn-save-user')    .attr('data-userid', '#')

        this.updateTableList()
    }

    update(userID)
    {
        this.state.users.forEach((user, index) => {
            if (user.id == userID) {
                this.state.users[index].name = $('input[name=edit--user-name]').val()
                this.state.users[index].bio = $('input[name=edit--user-bio]').val()
                this.state.users[index].location = $('input[name=edit--user-location]').val()
            }
        })

        this.updateTableList()

        if (!$('div.user-edit').hasClass('d-none')) {
            $('div.user-edit').addClass('d-none')
        }

        if ($('div.user-search').hasClass('d-none')) {
            $('div.user-search').removeClass('d-none')
        }
    }
}