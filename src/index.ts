const posts = document.querySelectorAll('.postprofile + .postbody .content')

for (const post of posts) {
    const links = post.querySelectorAll('.content > :not(blockquote) a[href^="https://drive.google.com/"], .content > a[href^="https://drive.google.com/"')
    if (!links.length)
        continue

    const media = [...links].map(l => {
        const href = l.getAttribute('href')
        if (!href)
            return
        const id = /^https:\/\/drive.google.com\/file\/d\/([^/]+)/.exec(href)?.[1]
        if (!id)
            return

        return {
            title: l.textContent ?? href,
            href,
            id
        }
    }).filter(x => x != null)

    post.insertAdjacentHTML('afterend', `<div class='ivelt-media__root'>
        ${media.map(m => `<div class='container'>
            <div class='skeleton'></div>
            <iframe 
                class='loading' 
                src='https://drive.google.com/file/d/${m!.id}/preview' 
                frameborder='0' 
                width='300'
                height='169'
                allowfullscreen>
                Your browser does not support this content
            </iframe>
        </div>`).join('')}
    </div>`)
}
