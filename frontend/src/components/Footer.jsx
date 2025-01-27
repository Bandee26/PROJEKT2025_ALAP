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
          <h5 className="text-uppercase">Szolgáltatások</h5>
          <ul className="list-unstyled">
            <li><a href="#!" className="text-dark">Web Design</a></li>
            <li><a href="#!" className="text-dark">Development</a></li>
            <li><a href="#!" className="text-dark">Hosting</a></li>
          </ul>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase">Contact</h5>
          <p>
            Mezőtúr Dózsa György út 17.<br />
            Email: info@hasznalautoker.hu<br />
            Phone: +36 1 456 789
          </p>
        </div>
      </div>
    </div>

    <div className="text-center p-3 bg-dark text-white">
      &copy; 2025 HAHU Website. Minden jog fenntartva.
    </div>
  </footer>
)
}