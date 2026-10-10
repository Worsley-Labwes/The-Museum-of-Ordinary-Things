import { useEffect, useState } from "react";

const starterExhibits = [
    {
        id: "first-rain",
        title: "The first rain after summer",
        category: "Moments",
        date: "2026-09-18",
        place: "On the walk home",
        story: "The pavement went dark in seconds. Everyone on the street looked up at the same time.",
        image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=85",
        favorite: true,
    },
    {
        id: "blue-mug",
        title: "The blue mug",
        category: "Objects",
        date: "2026-08-03",
        place: "Kitchen windowsill",
        story: "Chipped on the handle, somehow always the one I reach for. It makes ordinary tea feel like a small ritual.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
    {
        id: "long-way",
        title: "Taking the long way",
        category: "Places",
        date: "2026-07-21",
        place: "The path by the water",
        story: "No destination, no headphones. Just the sound of the water and an extra twenty minutes to myself.",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
    {
        id: "recipe-card",
        title: "A recipe in her handwriting",
        category: "Notes",
        date: "2026-06-12",
        place: "Inside the old cookbook",
        story: "There are no measurements, just 'until it looks right.' Somehow, it always does.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85",
        favorite: true,
    },
    {
        id: "window-light",
        title: "Light at 4:17 pm",
        category: "Moments",
        date: "2026-05-28",
        place: "The living room",
        story: "For a few minutes the whole room turned gold. Nobody said anything. We just stayed there.",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
    {
        id: "ticket-stub",
        title: "One more song",
        category: "Objects",
        date: "2026-04-09",
        place: "A ticket in my coat pocket",
        story: "We missed the last train and walked home singing the chorus we both knew by heart.",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
];

const categories = ["Everything", "Objects", "Moments", "Places", "Notes"];
const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

function readExhibits() {
    try {
        const saved = localStorage.getItem("ordinary-things-exhibits");
        return saved ? JSON.parse(saved) : starterExhibits;
    } catch {
        return starterExhibits;
    }
}

function formatDate(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function App() {
    const [exhibits, setExhibits] = useState(readExhibits);
    const [activeCategory, setActiveCategory] = useState("Everything");
    const [search, setSearch] = useState("");
    const [showSaved, setShowSaved] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedExhibit, setSelectedExhibit] = useState(null);

    useEffect(() => {
        localStorage.setItem("ordinary-things-exhibits", JSON.stringify(exhibits));
    }, [exhibits]);

    const visibleExhibits = exhibits.filter((exhibit) => {
        const matchesCategory = activeCategory === "Everything" || exhibit.category === activeCategory;
        const matchesSaved = !showSaved || exhibit.favorite;
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || [exhibit.title, exhibit.story, exhibit.place, exhibit.category]
            .some((value) => value.toLowerCase().includes(query));
        return matchesCategory && matchesSaved && matchesSearch;
    });

    function toggleFavorite(id) {
        setExhibits((current) => current.map((exhibit) => (
            exhibit.id === id ? { ...exhibit, favorite: !exhibit.favorite } : exhibit
        )));
        setSelectedExhibit((current) => current?.id === id ? { ...current, favorite: !current.favorite } : current);
    }

    function addExhibit(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const exhibit = {
            id: crypto.randomUUID(),
            title: form.get("title").trim(),
            category: form.get("category"),
            date: form.get("date"),
            place: form.get("place").trim() || "Somewhere worth remembering",
            story: form.get("story").trim(),
            image: form.get("image").trim(),
            favorite: false,
        };
        setExhibits((current) => [exhibit, ...current]);
        setActiveCategory("Everything");
        setShowSaved(false);
        setSearch("");
        setIsAdding(false);
    }

    function openSurprise() {
        if (visibleExhibits.length) {
            setSelectedExhibit(visibleExhibits[Math.floor(Math.random() * visibleExhibits.length)]);
        }
    }

    return (
        <div className="museum-shell">
            <aside className="sidebar">
                <a className="brand" href="#collection" aria-label="Museum of Ordinary Things home">
                    <span className="brand-mark" aria-hidden="true"><span /></span>
                    <span className="brand-name">ordinary<br />things<span className="brand-period">.</span></span>
                </a>

                <div className="sidebar-section-label">YOUR MUSEUM</div>
                <nav className="side-nav" aria-label="Museum views">
                    <button className={!showSaved ? "side-link active" : "side-link"} onClick={() => setShowSaved(false)}>
                        <span className="side-icon collection-icon" aria-hidden="true">▦</span>
                        <span>Collection</span>
                        <span className="side-count">{exhibits.length}</span>
                    </button>
                    <button className={showSaved ? "side-link active" : "side-link"} onClick={() => setShowSaved(true)}>
                        <span className="side-icon" aria-hidden="true">♡</span>
                        <span>Favorites</span>
                        <span className="side-count">{exhibits.filter((exhibit) => exhibit.favorite).length}</span>
                    </button>
                </nav>

                <div className="sidebar-note">
                    <span className="note-spark" aria-hidden="true">✳</span>
                    <p>A place for the little things that turn out to be the big things.</p>
                </div>

                <div className="sidebar-bottom">
                    <span className="online-dot" /> A museum of one, and growing
                </div>
            </aside>

            <main className="main-content" id="collection">
                <header className="topbar">
                    <div className="breadcrumb"><span>YOUR MUSEUM</span><span className="breadcrumb-slash">/</span><strong>{showSaved ? "FAVORITES" : "THE COLLECTION"}</strong></div>
                    <button className="add-button" onClick={() => setIsAdding(true)}><span aria-hidden="true">+</span> Add an exhibit</button>
                </header>

                <section className="intro">
                    <div className="intro-copy">
                        <p className="eyebrow"><span className="eyebrow-line" /> A CABINET OF CURIOSITIES, PERSONAL EDITION</p>
                        <h1>The Museum of<br /><em>Ordinary</em> Things<span className="title-period">.</span></h1>
                        <p className="intro-description">Small moments. Everyday artifacts. Things you almost forgot<br className="desktop-break" /> were worth keeping.</p>
                    </div>
                    <div className="intro-stamp" aria-label={`${exhibits.length} exhibits collected`}>
                        <span className="stamp-number">{String(exhibits.length).padStart(2, "0")}</span>
                        <span className="stamp-label">THINGS<br />COLLECTED</span>
                        <span className="stamp-star" aria-hidden="true">✳</span>
                    </div>
                </section>

                <section className="collection-section" aria-label="Exhibit collection">
                    <div className="section-heading">
                        <div>
                            <h2>{showSaved ? "Your favorites" : "The collection"}</h2>
                            <p>{visibleExhibits.length === 1 ? "1 exhibit" : `${visibleExhibits.length} exhibits`} <span className="heading-dot">·</span> each one a little world</p>
                        </div>
                        <button className="surprise-button" onClick={openSurprise} disabled={!visibleExhibits.length}>
                            <span aria-hidden="true">✳</span> Surprise me
                        </button>
                    </div>

                    <div className="collection-tools">
                        <div className="category-tabs" aria-label="Filter by category">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={activeCategory === category ? "category-tab selected" : "category-tab"}
                                    onClick={() => setActiveCategory(category)}
                                >{category}</button>
                            ))}
                        </div>
                        <label className="search-box">
                            <span aria-hidden="true">⌕</span>
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find an exhibit" aria-label="Search exhibits" />
                            <kbd>/</kbd>
                        </label>
                    </div>

                    {visibleExhibits.length ? (
                        <div className="exhibit-grid">
                            {visibleExhibits.map((exhibit, index) => (
                                <article className={`exhibit-card${index === 0 ? " featured-card" : ""}`} key={exhibit.id}>
                                    <div className={`exhibit-image image-${index % 5}`}>
                                        {exhibit.image ? <img src={exhibit.image} alt="" loading={index > 2 ? "lazy" : "eager"} /> : <span className="image-placeholder" aria-hidden="true">✳</span>}
                                        <span className="image-date">{formatDate(exhibit.date)}</span>
                                        <button className={exhibit.favorite ? "favorite-button is-favorite" : "favorite-button"} onClick={() => toggleFavorite(exhibit.id)} aria-label={exhibit.favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={exhibit.favorite}>
                                            {exhibit.favorite ? "♥" : "♡"}
                                        </button>
                                        <button className="image-open" onClick={() => setSelectedExhibit(exhibit)} aria-label={`Open ${exhibit.title}`} />
                                    </div>
                                    <div className="exhibit-caption">
                                        <div className="exhibit-meta"><span>{exhibit.category}</span><span className="meta-dot">·</span><span>{exhibit.place}</span></div>
                                        <button className="exhibit-title" onClick={() => setSelectedExhibit(exhibit)}>{exhibit.title}</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span aria-hidden="true">✳</span>
                            <h3>Nothing on this wall just yet.</h3>
                            <p>Try another filter, or add the first thing to your collection.</p>
                            <button className="add-button" onClick={() => setIsAdding(true)}>+ Add an exhibit</button>
                        </div>
                    )}
                </section>

                <footer className="page-footer"><span>TAKE YOUR TIME IN HERE.</span><span>MADE OF LITTLE THINGS <span className="footer-heart">♥</span></span></footer>
            </main>

            {isAdding && (
                <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsAdding(false)}>
                    <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="add-title">
                        <button className="dialog-close" onClick={() => setIsAdding(false)} aria-label="Close">×</button>
                        <p className="eyebrow"><span className="eyebrow-line" /> NEW ACQUISITION</p>
                        <h2 id="add-title">Add to the collection<span className="title-period">.</span></h2>
                        <p className="dialog-intro">What would you like to remember?</p>
                        <form className="exhibit-form" onSubmit={addExhibit}>
                            <label className="form-field full-field">Exhibit title<input name="title" required maxLength="80" placeholder="The song from the open window" /></label>
                            <div className="form-row">
                                <label className="form-field">Kind of thing<select name="category" defaultValue="Moments"><option>Objects</option><option>Moments</option><option>Places</option><option>Notes</option></select></label>
                                <label className="form-field">When<input name="date" type="date" required defaultValue={today} /></label>
                            </div>
                            <label className="form-field full-field">Where was it?<input name="place" maxLength="80" placeholder="A place, a pocket, a passing thought" /></label>
                            <label className="form-field full-field">The story<textarea name="story" required rows="3" maxLength="500" placeholder="The detail you don't want to lose..." /></label>
                            <label className="form-field full-field">Image URL <span className="optional-label">OPTIONAL</span><input name="image" type="url" placeholder="https://..." /></label>
                            <button className="submit-button" type="submit">Place it in the museum <span aria-hidden="true">↗</span></button>
                        </form>
                    </section>
                </div>
            )}

            {selectedExhibit && (
                <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedExhibit(null)}>
                    <section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title">
                        <button className="dialog-close detail-close" onClick={() => setSelectedExhibit(null)} aria-label="Close">×</button>
                        <div className="detail-image">
                            {selectedExhibit.image ? <img src={selectedExhibit.image} alt="" /> : <span aria-hidden="true">✳</span>}
                        </div>
                        <div className="detail-copy">
                            <div className="exhibit-meta"><span>{selectedExhibit.category}</span><span className="meta-dot">·</span><span>{formatDate(selectedExhibit.date)}</span></div>
                            <h2 id="detail-title">{selectedExhibit.title}</h2>
                            <p className="detail-place">{selectedExhibit.place}</p>
                            <p className="detail-story">{selectedExhibit.story}</p>
                            <button className="detail-favorite" onClick={() => toggleFavorite(selectedExhibit.id)}>{selectedExhibit.favorite ? "♥ Saved to favorites" : "♡ Save to favorites"}</button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;
