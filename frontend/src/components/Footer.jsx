export default function Footer(){
return(
    <footer className="bg-light text-center text-lg-start">
    <div className="container p-4">
      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase">Rólunk</h5>
          <p>
          2024 óta vagyunk a használtautó piacon.
          Folyamatosan újuló járműparkunk várja kedves vásárlóit.
          </p>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase">Partnereink</h5>
          <ul className="list-unstyled">
            <li><a target="_blank" href="https://www.hasznaltauto.hu/" className="text-dark">Használtautó.hu</a></li>
   
          </ul>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase">Kapcsolatfelvétel</h5>
          <p>
            Mezőtúr Dózsa György út 17.<br />
            Email: info@hasznalautoker.hu<br />
            Telefon: +36 1 456 789
          </p>
        </div>
      </div>
    </div>

    <div className="text-center p-3 bg-dark text-white">
      &copy; 2025 B&K Autókereskedés. Minden jog fenntartva.
    </div>
  </footer>
)
}