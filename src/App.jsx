//                                                           Qisqa tushuntirish

// usememo nima usememo asosan state va style ni eslab qoladi hamma narsa uida ozgarsaham u eski qiymatni saqlab qoladi 
// va asosan katta datalar bilan ishlar ekan kichik tatalar bo'lsa kerak emas bu renderni useefect kabi toxtatmaydi u faqat valueni yani qiymatni kesh qiladi

// useEfect bu asosan renderdan keyin bajariladigan ish harakati va u quydagilarni hususiyatlarga ega
//  API-ni yuklab oling
// localStorage bilan ishlash
// event listener qo'shish
// taymers etTimeout setInterval
// DOM bilan ishlash


import { useEffect, useMemo, useState } from "react";

export default function App() {
  
  const [state, setState] = useState([]);

  
  const [style, setStyle] = useState("hayot");


  const [loader, setLoader] = useState(false);


  const [error, setError] = useState(false);

  function handleChange(evt) {
    setStyle(evt.target.value);
  }

  useEffect(() => {
    setLoader(true);
    setError(false);

    fetch(`https://jsonbek.uz/api/posts?style=${style}`)
      .then((res) => res.json())
      .then((res) => {
        
        const list = Array.isArray(res) ? res : (res.data ?? res.posts ?? []);
        setState(list);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoader(false));
  }, [style]);

  
  const filtered = useMemo(() => {
    return state.filter((p) => (p.category ?? p.style ?? "") === style);
  }, [state, style]);

  if (loader) {
    return <p>loading...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <b>Xatolik:</b> API dan ma’lumot kelmadi.
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <select onChange={handleChange} value={style}>
        <option value="hayot">hayot</option>
        <option value="ovqat">ovqat</option>
        <option value="oilaviy">oilaviy</option>
        <option value="kulgu">kulgu</option>
      </select>

      <p style={{ marginTop: 12 }}>
        Topildi afandim: <b>{filtered.length}</b> ta post
      </p>

      {filtered.map((el) => (
       <div
       key={el.id}
       style={{
        border:"1px solid #ddd",
        borderRadius:12,
        padding:12,
        marginTop:12,
       }}   
       >
        <h2 style={{margin: 0 }}>{el.title}</h2>
        <p style={{margin:"8px 0"}}>{el.body}</p>
        <div style={{display:"flex" , gap:12, fontSize:14, opacity:1}}>
         <span>🧑‍🦰{el.author}</span>
          <span>🗓️{el.date}</span>
           <span>❤️{el.likes}</span>
            <span>📋{el.category}</span>
        </div>
        </div>
      ))}
    </div>
  );
}