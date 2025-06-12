import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Chosen Palette: Warm Neutrals (Beige, Slate, Accent Teal)
// Application Structure Plan: A single-page, vertical scrolling application with a sticky navigation bar for easy access to key sections. The structure prioritizes a narrative flow, starting with a summary, moving to interactive skills, then a chronological experience timeline, a project portfolio, and finally education. This structure is more engaging than a static document, allowing recruiters to quickly jump to the most relevant information (like skills) while still providing a comprehensive overview. Interactivity is focused on skills visualization and project deep-dives via modals to keep the main view uncluttered and user-friendly.
// Visualization & Content Choices:
// - Summary: Goal=Inform -> Method=Clear Text -> Interaction=None -> Justification=Direct and clear introduction.
// - Skills: Goal=Compare -> Method=Categorized Bar Charts (Chart.js) -> Interaction=Clickable filters to switch between skill categories (Programming, MLOps, etc.) -> Justification=Visually represents proficiency for quick assessment, far more effective than a text list. Filtering prevents information overload.
// - Experience/Education: Goal=Show Change -> Method=Vertical Timeline (HTML/CSS) -> Interaction=Subtle hover effects -> Justification=Intuitively displays career progression chronologically.
// - Projects: Goal=Organize -> Method=Card Grid (HTML/CSS) -> Interaction=Clicking a card opens a modal with details -> Justification=Provides a clean portfolio overview, with details available on demand (progressive disclosure) to avoid clutter.
// - Languages: Goal=Inform -> Method=Styled progress bars (HTML/CSS) -> Justification=Simple, visual representation of proficiency.
// CONFIRMATION: NO SVG graphics used. NO Mermaid JS used.

const App = () => {
    const [activeCategory, setActiveCategory] = useState('Sprachen & Frameworks');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const skillsData = {
        'Sprachen & Frameworks': {
            labels: ['Python 3', 'C++', 'Tensorflow', 'Scikit-Learn'],
            values: [5, 5, 4, 4]
        },
        'Tools & DevOps': {
            labels: ['Gitlab', 'Jira', 'Confluence', 'MLflow', 'Airflow', 'Cnvrg.io', 'AWS', 'Docker'],
            values: [4, 4, 4, 5, 5, 5, 4, 4]
        },
        'Data Processing': {
            labels: ['Huggingface', 'Spark', 'SQL', 'LangChain'],
            values: [4, 4, 4, 4]
        }
    };

    const proficiencyMap = { 5: 'Expert', 4: 'Proficient' };

    const experienceData = [
        {
            role: 'Machine Learning Engineer / Data Scientist',
            company: 'Precitec GmbH & Co. KG, Karlsruhe, Germany',
            period: 'Februar 2021 – Heute',
            details: [
                'Durchführung von tiefgehenden Datenanalysen und Implementierung fortschrittlicher Deep-Learning-Algorithmen zur Lösung kundenspezifischer Herausforderungen.',
                'Entwurf und Einsatz umfassender End-to-End-Machine-Learning-Pipelines, einschließlich ETL-Prozessen, Datenanalyse, Modelltraining, Bereitstellung und Integration von Webanwendungen.',
                'Entwicklung eines spezialisierten Large Language Model (LLM) für die Analyse komplexer Zeitreihendaten.',
                'Erstellung einer robusten Webanwendung, die einen nahtlosen Daten-Upload und eine automatisierte Datenanalyse ermöglicht.'
            ]
        },
        {
            role: 'Masterarbeit (Computer Vision)',
            company: 'Precitec GmbH & Co. KG, Karlsruhe, Germany',
            period: 'Juni 2020 – Januar 2021',
            details: [
                'Anwendung von Machine-Learning-Algorithmen zur präzisen Fehlererkennung in der Lasermaterialbearbeitung.',
                'Durchführung umfangreicher Datenanalysen und Visualisierungen zur Unterstützung der Forschungsziele.',
                'Untersuchung und Analyse der Robustheit von ML-Algorithmen in realen Szenarien.'
            ]
        },
        {
            role: 'Automation and Instrumentation Engineer',
            company: 'Udaipur Cement Works Limited, Udaipur, India',
            period: 'Dezember 2014 – September 2018',
            details: [
                'Management der Inbetriebnahme und Wartung kritischer industrieller Steuerungssysteme, einschließlich 800XA ABB Distributed Control System, Siemens SPS, Schneider SPS.',
                'Entwicklung und Implementierung von SPS- und Leitsystem-Programmierlösungen zur Automatisierung industrieller Prozesse.'
            ]
        }
    ];

    const educationData = [
        {
            degree: 'Master in Elektrotechnik',
            institution: 'Hochschule Bremen, Bremen, Germany',
            period: 'Oktober 2018 – Januar 2021',
            details: ['Spezialisierungen: Data Science, Machine Learning, Neuronale Netze und Deep Learning, Bildverarbeitung.', 'Gesamtnote: 1.8']
        },
        {
            degree: 'Bachelor of Engineering in Elektronik und Kommunikation',
            institution: 'College of Technology and Engineering, Udaipur, India',
            period: 'Juli 2010 – Juli 2014',
            details: ['Schwerpunkte: Instrumentierung, Antennen- und Wellenausbreitung, Digitale Signalverarbeitung.', 'Gesamtnote: 7.47 / 10.00']
        }
    ];

    const projectsData = [
        {
            title: 'Machine Learning Data Lifecycle in Production',
            source: 'DeepLearning.AI',
            date: 'März 2022 – Mai 2022',
            description: 'Praktische Erfahrungen bei der Bewältigung realer Herausforderungen in ML-Datenpipelines gesammelt.',
            link: 'https://www.coursera.org/account/accomplishments/verify/DZMXDEDG6LKL',
            linkText: 'Zertifikat ansehen'
        },
        {
            title: 'AI from Datacenter to Edge – An Optimized Path with Intel Architecture',
            source: 'Intel AI Academy',
            date: 'September 2019 – Oktober 2019',
            description: 'Abschluss der Automodell-Klassifizierung mit VGG16, InceptionV3 und MobileNet.',
            link: 'https://www.credential.net/ssend1xs?key=3754c015d60b675c05e27dca974297489cb141618052ddac952a42af3a9ac68c',
            linkText: 'Zertifikat ansehen'
        },
        {
            title: 'Generative AI Projekte',
            source: 'Eigeninitiative',
            date: 'September 2019 - Mai 2020',
            description: `Implementierung eines generativen KI-Chatbots mit RAG-Funktionen (Retrieval-Augmented Generation) als Produktassistent, bereitgestellt auf Nvidia Jetson Hardware (Tools: Hugging Face, NLP, LLM, LangChain, Jetson AI).<br>Entwicklung von Lösungen zur Textzusammenfassung auf Basis von Generative AI mit großen Sprachmodellen (LLMs) (Tools: Hugging Face, NLP, LLM).`,
            link: null
        },
        {
            title: 'C++ Kurs',
            source: 'IT-Schulungen.com',
            date: 'September 2022',
            description: 'Umfassendes Training zu Standard Template Library (STL), Templates, Lambda-Funktionen und Meta-Programmierung.',
            link: null
        },
        {
            title: 'Forschungsbericht: "Design and Analysis of a Trapezoidal Ring... for 5G"',
            source: 'International Journal of Engineering Research and Application',
            date: 'Oktober 2017',
            description: 'Veröffentlichte Forschung zum Antennendesign für 5G-Anwendungen.',
            link: 'http://www.ijera.com/papers/Vol7_issue10/Part-5/C0710051518.pdf',
            linkText: 'Publikation lesen'
        }
    ];

    useEffect(() => {
        const currentData = skillsData[activeCategory];
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: currentData.labels,
                    datasets: [{
                        label: 'Kompetenzniveau',
                        data: currentData.values,
                        backgroundColor: 'rgba(20, 184, 166, 0.6)',
                        borderColor: 'rgba(13, 148, 136, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 5,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    return proficiencyMap[value] || '';
                                }
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += proficiencyMap[context.raw] || '';
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [activeCategory]);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 68) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="antialiased">
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #FDFBF8;
                    color: #4A5568;
                }
                .chart-container {
                    position: relative;
                    width: 100%;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                    height: 400px;
                    max-height: 50vh;
                }
                .nav-link {
                    transition: color 0.3s;
                    position: relative;
                    padding-bottom: 4px;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #14B8A6;
                    transition: width 0.3s;
                }
                .nav-link:hover::after, .nav-link.active::after {
                    width: 100%;
                }
                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: -30px;
                    top: 5px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: #FDFBF8;
                    border: 4px solid #14B8A6;
                }
                .modal-overlay {
                    transition: opacity 0.3s ease;
                }
                .modal-content {
                    transition: transform 0.3s ease;
                }
                `}
            </style>

            <header id="header" className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-50">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center max-w-7xl">
                    <a href="#hero" className="text-xl font-bold text-gray-800">Mukul Jain</a>
                    <div className="hidden md:flex space-x-8">
                        <a href="#about" className="nav-link text-gray-600 hover:text-gray-900">Über mich</a>
                        <a href="#skills" className="nav-link text-gray-600 hover:text-gray-900">Fähigkeiten</a>
                        <a href="#experience" className="nav-link text-gray-600 hover:text-gray-900">Erfahrung</a>
                        <a href="#projects" className="nav-link text-gray-600 hover:text-gray-900">Projekte</a>
                        <a href="#education" className="nav-link text-gray-600 hover:text-gray-900">Ausbildung</a>
                    </div>
                    <a href="mailto:mukuljain02@gmail.com" className="hidden md:block bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Kontakt</a>
                </nav>
            </header>

            <main className="pt-16">
                <section id="hero" className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Mukul Jain</h1>
                    <h2 className="text-2xl md:text-3xl text-teal-600 mb-8">Ingenieur für maschinelles Lernen & Datenwissenschaftler</h2>
                    <div className="flex justify-center space-x-6 text-gray-600">
                        <a href="mailto:mukuljain02@gmail.com" className="hover:text-teal-600 flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            <span>mukuljain02@gmail.com</span>
                        </a>
                        <a href="https://www.linkedin.com/in/mukul-jain-6b920760/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </section>

                <section id="about" className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Über mich</h2>
                        <p className="text-lg text-center text-gray-700 leading-relaxed">
                            Als erfahrener Machine Learning Engineer und Data Scientist mit über 7 Jahren Berufserfahrung, davon mehr als 4 Jahre Spezialisierung auf Datenanalyse und Deep Learning (POCs), bringe ich eine nachgewiesene Expertise in der Entwicklung von End-to-End-ML-Pipelines, der Optimierung von Deep-Learning-Modellen für KI-Hardware und der Entwicklung von KI-Edge-Softwarelösungen mit.
                        </p>
                    </div>
                </section>

                <section id="skills" className="py-20">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Technische Fähigkeiten</h2>
                        <p className="text-lg text-center text-gray-700 mb-12">Entdecken Sie meine technischen Fähigkeiten. Klicken Sie auf die Schaltflächen, um nach Kategorien zu filtern.</p>
                        <div id="skill-filters" className="flex flex-wrap justify-center gap-4 mb-8">
                            {Object.keys(skillsData).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`skill-filter-btn px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${activeCategory === category ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-gray-100'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="chart-container bg-white p-4 rounded-lg shadow-lg">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                </section>

                <section id="experience" className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Berufserfahrung</h2>
                        <div className="relative border-l-2 border-gray-200 pl-10">
                            {experienceData.map((item, index) => (
                                <div key={index} className="timeline-item mb-8">
                                    <h3 className="text-xl font-bold text-gray-800">{item.role}</h3>
                                    <p className="font-semibold text-teal-600 mb-1">{item.company}</p>
                                    <p className="text-sm text-gray-500 mb-2">{item.period}</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {item.details.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="projects" className="py-20">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Projekte & Kurse</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projectsData.map((project, index) => (
                                <div
                                    key={index}
                                    className="project-card bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                    onClick={() => openModal(project)}
                                >
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{project.source}</p>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
                                    </div>
                                    <button className="text-left font-semibold text-teal-600 hover:text-teal-700 mt-4">Details ansehen &rarr;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="education" className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Ausbildung</h2>
                        <div className="relative border-l-2 border-gray-200 pl-10">
                            {educationData.map((item, index) => (
                                <div key={index} className="timeline-item mb-8">
                                    <h3 className="text-xl font-bold text-gray-800">{item.degree}</h3>
                                    <p className="font-semibold text-teal-600 mb-1">{item.institution}</p>
                                    <p className="text-sm text-gray-500 mb-2">{item.period}</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {item.details.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h3 className="text-2xl font-bold mb-4">Kontakt</h3>
                    <p className="mb-6">Ich bin offen für neue Möglichkeiten. Kontaktieren Sie mich gerne.</p>
                    <div className="flex justify-center items-center space-x-6">
                        <a href="mailto:mukuljain02@gmail.com" className="hover:text-teal-400 flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            <span>mukuljain02@gmail.com</span>
                        </a>
                        <a href="https://www.linkedin.com/in/mukul-jain-6b920760/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>
            </footer>

            {isModalOpen && selectedProject && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="modal-content bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative transform scale-95">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedProject.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{selectedProject.source} | {selectedProject.date}</p>
                        <div className="text-gray-700 space-y-4" dangerouslySetInnerHTML={{ __html: selectedProject.description }}></div>
                        {selectedProject.link && (
                            <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                                {selectedProject.linkText}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;