
import Sidebar from "../components/Sidebar";
import "./InformationPage.css";

function InformationPage() {

  return (
    <div className="information-page">

      <Sidebar />

      <main className="information-content">

        <header className="page-header">

          <span>INFORMACIÓN</span>

          <h1>
            Sobre el sistema SAS
          </h1>

          <p>
            Conoce las funciones principales
            de la plataforma.
          </p>

        </header>


        <section className="information-main">

          <div className="information-text">

            <span className="section-label">
              ¿QUÉ ES SAS?
            </span>

            <h2>
              Sistema de Administración
              de Surtidores
            </h2>

            <p>
              SAS es una plataforma diseñada
              para consultar información de
              diferentes estaciones de servicio
              de manera rápida y organizada.
            </p>

            <p>
              El sistema permite visualizar
              precios, disponibilidad de
              combustible, cantidad de vehículos
              en cola y estado de funcionamiento
              de los surtidores.
            </p>

          </div>


          <div className="information-image">

            <img
              src="/surtidor-info.jpg"
              alt="Surtidor de combustible"
            />

          </div>

        </section>


        <section className="features">

          <div className="section-title">

            <span className="section-label">
              FUNCIONES
            </span>

            <h2>
              ¿Qué puedes consultar?
            </h2>

          </div>


          <div className="features-grid">

            <div className="feature-card">

              <span>⛽</span>

              <h3>
                Surtidores
              </h3>

              <p>
                Consulta información detallada
                de cada estación.
              </p>

            </div>


            <div className="feature-card">

              <span>💰</span>

              <h3>
                Precios
              </h3>

              <p>
                Revisa los precios de los
                diferentes combustibles.
              </p>

            </div>


            <div className="feature-card">

              <span>🚗</span>

              <h3>
                Colas
              </h3>

              <p>
                Conoce la cantidad de vehículos
                esperando en cada estación.
              </p>

            </div>


            <div className="feature-card">

              <span>📊</span>

              <h3>
                Estadísticas
              </h3>

              <p>
                Analiza el estado general
                de los surtidores.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default InformationPage;

