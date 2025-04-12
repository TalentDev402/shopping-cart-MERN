import ItemImg1 from 'assets/images/services/s1.jpg'
import ItemImg2 from 'assets/images/services/s2.jpg'
import ItemImg3 from 'assets/images/services/s3.jpg'
import ItemImg4 from 'assets/images/services/s4.png'
import {
    CheckCircleFilled
} from '@ant-design/icons';

const ServicesPage = () => {
    return (
        <div className='relative m-auto'>
            <div className="inset-0" style={{ backgroundImage: "url(/img/services/sb1.jpg)", backgroundSize: "cover" }}>
                <div className="m-auto container md:p-0 flex grid grid-cols-1 md:grid-cols-2">
                    <div className="mt-12 md:mt-24 md:ml-24">
                        <h5 className='text-[#F185BD] text-[4vw] md:text-[3vw]'>簡介</h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[#9a8984]">
                            珍品匯品牌，堅守以健康生活由營養開始。我們的營養師，以天然、拒絕用藥或療程，以藥食同源及對人體無刺激及無害的天然營養補充品，搭配飲食及運動餐單，提供高私隱及１對１的營養、減肥、健康咨詢，透過瞭解個人飲食及生活習慣，提供專業營養建議，讓您能有效及持久保持良性飲食習慣及身體健康。在飲食加運動建議結合下，實現（飽住瘦 ）不再餓肚子，不再對碳水和減脂產生焦慮情緒，真正達到輕鬆持久的減肥效果！這將是您保持美麗和健康長壽的開始。
                        </h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[#9a8984]">
                            要保持身體健康，或者達到減肥的效果，最好的過程一定是{"{自然}"}發生的一切，運動只佔了3分，7分重點在於吃，飲食是很多人肥胖原兇，尤其是都市人生活忙碌，快餐、零食、飲料都會影響我們期待的效果，如何吃和吃什麼， 顯得格外重要。
                        </h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[#FF0001]">
                            首次咨詢客人享有體驗價︰(線上咨詢20分鐘 300港元)
                        </h5>
                        <br />
                        <br />
                    </div>
                    <div className="md:mt-48 mt-4 md:mb-0 mb-10 md:ml-12">
                        <img src={ItemImg1} className='md:float-left m-auto rounded-[15px] md:w-2/3' />
                    </div>
                </div>
            </div>
            <div className="inset-0 bg-[#f9e7e5]">
                <div className="m-auto container flex justify-between grid grid-cols-1 md:grid-cols-2">
                    <div className="md:mt-20 md:ml-24">
                        <h2 className='text-[#306960] text-[8vw] md:text-[2vw]'>營養咨詢服務</h2>
                        <br />
                        <h2 className='text-[#306960] text-[5vw] md:text-[3vw]'>健康輕盈減脂(飽住瘦，不再捱餓)</h2>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[#6a8e87]">
                            肥胖危害健康的威脅大於吸煙，「胖」除了影響正常社交，更會帶來很多慢性疾病。
                        </h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[#6a8e87]">
                            體重失控超標，引起很多的併發症，例如一些: 心臟病、關節問題、膽結石、脂肪肝、高血壓、糖尿病、高血脂，嚴重的更會引起癌症的可能，如乳癌、子宮癌、大腸癌這些都常見於肥胖者身上。而且肥胖的人死亡率也比正常人多達接近10倍。
                        </h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[#6a8e87]">
                            我們的營養師，專針解決肥胖為客人帶來的煩惱及痛苦，整個過程會嚴格跟進你的進度，直到完成整個飲食或營養計劃，以細心查問、貼身觀察、制定個人方案，讓每個人在合適自己的情況下輕鬆開心變回健康及美麗，同時也會定期跟進提供飲食指導及運動建議，以達到改善體質，預防疾病及控制體重。
                        </h5>
                        <br />
                        <br />
                    </div>
                    <div className="md:ml-12">
                        <img src={ItemImg2} className='md:h-full object-cover' />
                    </div>
                </div>
            </div>
            <div className="inset-0 bg-[#ffb3e3]">
                <div className="m-auto container flex justify-between grid grid-cols-1 md:grid-cols-2">
                    <div className="">
                        <img src={ItemImg3} className='float-right md:mr-16 md:h-full object-cover' />
                    </div>
                    <div className="mt-12 md:mr-36">
                        <h2 className='text-[black] text-[4.5vw] md:text-[3vw]'>Q & A</h2>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[blue]">能快速減肥嗎?</h5>
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[black]">NO！快速，反彈也快！而且我們不用藥及刺激身體的方案，加上每人減肥的進度不同，所以才需要一對一高私隱跟進。在正常都市人繁忙的工作環境下，進度應以月來計算約3-6磅，同時在過程營養師不斷作出調整。</h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[blue]">能局部減肥嗎?</h5>
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[black]">營養師不能控制或轉移身體部份的脂肪積聚，亦不能指定排除身體某部份脂肪。但是我們在運動建議上則能透過輕度重量運動的方法收緊及塑造線條。</h5>
                        <br />
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[blue]">飲食餐單會影響生活嗎?</h5>
                        <h5 className="text-[3.5vw] md:text-[1.2vw] text-[black]">首先，我們不需要把減肥想得太極端，也不會好像坊間每一餐都要使用磅秤的方式進食，那是健美比賽的操作，減肥是一件自律及自然的事，自我節制加上營養師監督即可很大程度控制體重。相反，很多人過度節食，太急進的減脂會造成心理及焦慮帶來壓力。營養師會給予妳們很大的幫助，讓你們可以吃喜愛的食物， 又達到減肥效果。</h5>
                        <br />
                        <br />
                    </div>
                </div>
            </div>
            <div className="inset-0 bg-[#bfd202] md:pb-24 md:pt-24">
                <div className="m-auto container flex justify-between grid grid-cols-1 md:grid-cols-2">
                    <div className="md:ml-48 md:w-[80%]">
                        <h2 className='text-[#095247] text-[8vw] md:text-[3vw]'>What we provide</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4.5vw] md:text-[2vw]'>收費 :</h2>
                        <ul className='list-disc'>
                            <li className="text-[3.5vw] md:text-[1.5vw] text-[#447a31] ml-12">
                                首次營養評估及指導 (45至60分鐘)：$800
                            </li>
                            <li className="text-[3.5vw] md:text-[1.5vw] text-[#447a31] ml-12">
                                跟進營養指導 (15至30分鐘)：$480
                            </li>
                            <li className="text-[3.5vw] md:text-[1.5vw] text-[#447a31] ml-12">
                                持有綜援紙/低收家庭/單親家庭(需有證明) 一律收費 $480
                            </li>
                            <li className="text-[3.5vw] md:text-[1.5vw] text-[#447a31] ml-12">
                                (基於身體狀況的改變，營養指導超過六個月或以上，則當首次咨詢)
                            </li>
                        </ul>
                    </div>
                    <div className="md:mb-0 mb-4">
                        <img src={ItemImg4} className='m-auto md:w-1/2 md:h-3/4 md:mt-24 object-fit rounded-[15px]' />
                    </div>
                </div>
            </div>
            <h2 className='mt-6 text-center text-[#095247] text-[8vw] md:text-[3vw]'>What we provide</h2>
            <div className="container w-[90%] inset-0 mt-6 bg-[#fce693] pt-12 pb-16 md:pb-36">
                <div className="m-auto md:p-0 md:ml-8 md:mr-8 flex md:flex-row flex-col items-start gap-2">
                    <h1 className='text-center items-center w-full mb-4 md:mb-0 md:hidden block'>
                        <CheckCircleFilled className='text-[8vw] m-auto' style={{ color: "white" }} />
                    </h1>
                    <CheckCircleFilled className='xl:mt-0 mt-1 md:text-[3vw] hidden md:inline' style={{ color: "white" }} />
                    <div>
                        <h2 className='text-[#095247] text-[5vw] md:text-[2vw]'>排毒營養咨詢</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>生活在香港的都市人，不少人都面對體內濕毒，排便不順暢等問題困擾，也因此產生很多皮膚表層問題，其實源頭都在於體內毒素過多。</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>隨著年齡增長代謝降低，而城市空氣變化、工作壓力、吸煙喝酒等產生更多的自由基加快了衰老，是人體健康的大敵。 </h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>營養師會針對延緩人體功能老化，提供抗衰老的生活習慣及飲食技巧配搭及排毒營養補充品，加上適量的運動建議達到提升消化系統功能、改善體質、預防生病及抗衰老。</h2>
                        <br />
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>收費 :</h2>
                        <ul className='list-disc'>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                首次營養評估及指導 (45至60分鐘)：$800
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                跟進營養指導 (15至30分鐘)：$480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                持有綜援紙/低收家庭/單親家庭(需有證明) 一律收費480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                (基於身體狀況的改變，營養指導超過六個月或以上，則當首次咨詢)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container w-[90%] inset-0 bg-[#fce693] pt-12 pb-16 md:pb-36">
                <div className="m-auto md:p-0 md:ml-8 md:mr-8 flex md:flex-row flex-col items-start gap-2">
                    <h1 className='text-center items-center w-full mb-4 md:mb-0 md:hidden block'>
                        <CheckCircleFilled className='text-[8vw] m-auto' style={{ color: "white" }} />
                    </h1>
                    <CheckCircleFilled className='xl:mt-0 mt-1 md:text-[3vw] hidden md:inline' style={{ color: "white" }} />
                    <div>
                        <h2 className='text-[#095247] text-[5vw] md:text-[2vw]'>有營運動計劃咨詢</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>不管出於減肥、健康、身體機能的訴求，運動是人們必不可避免的。營養師會因應個人的情況、體重、承受能力、肌力去提供一個合適的漸進式運動計劃搭配營養補充品及飲食餐單。</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>有營運動計劃，為不少老年人加速血液循環，增強他們的活力強化體力，令生活增添一份色彩，另外普通的都市人也能維持身體的健康機能，達到健康心肺功能，提升基礎代謝率及燃燒脂肪的好處，配備運動教練實地陪伴練習、陪伴減肥、監督進度、調整姿勢等。</h2>
                        <br />
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>收費 :</h2>
                        <ul className='list-disc'>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                首次營養評估及指導 (45至60分鐘)：$800
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                跟進營養指導 (15至30分鐘)：$480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                持有綜援紙/低收家庭/單親家庭(需有證明) 一律收費480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                (基於身體狀況的改變，營養指導超過六個月或以上，則當首次咨詢)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container w-[90%] inset-0 bg-[#fce693] pt-12 pb-16 md:pb-36">
                <div className="m-auto md:p-0 md:ml-8 md:mr-8 flex md:flex-row flex-col items-start gap-2">
                    <h1 className='text-center items-center w-full mb-4 md:mb-0 md:hidden block'>
                        <CheckCircleFilled className='text-[8vw] m-auto' style={{ color: "white" }} />
                    </h1>
                    <CheckCircleFilled className='xl:mt-0 mt-1 md:text-[3vw] hidden md:inline' style={{ color: "white" }} />
                    <div>
                        <h2 className='text-[#095247] text-[5vw] md:text-[2vw]'>婦女懷孕前/產後營養咨詢 ( 1小時 800港元)</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>不管出於減肥、健康、身體機能的訴求，運動是人們必不可避免的。營養師會因應個人的情況、體重、承受能力、肌力去提供一個合適的漸進式運動計劃搭配營養補充品及飲食餐單。</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>有營運動計劃，為不少老年人加速血液循環，增強他們的活力強化體力，令生活增添一份色彩，另外普通的都市人也能維持身體的健康機能，達到健康心肺功能，提升基礎代謝率及燃燒脂肪的好處，配備運動教練實地陪伴練習、陪伴減肥、監督進度、調整姿勢等。</h2>
                        <br />
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>收費 :</h2>
                        <ul className='list-disc'>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                首次營養評估及指導 (45至60分鐘)：$800
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                跟進營養指導 (15至30分鐘)：$480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                持有綜援紙/低收家庭/單親家庭(需有證明) 一律收費480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                (基於身體狀況的改變，營養指導超過六個月或以上，則當首次咨詢)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container w-[90%] inset-0 bg-[#fce693] pt-12 pb-16 md:pb-36">
                <div className="m-auto md:p-0 md:ml-8 md:mr-8 flex md:flex-row flex-col items-start gap-2">
                    <h1 className='text-center items-center w-full mb-4 md:mb-0 md:hidden block'>
                        <CheckCircleFilled className='text-[8vw] m-auto' style={{ color: "white" }} />
                    </h1>
                    <CheckCircleFilled className='xl:mt-0 mt-1 md:text-[3vw] hidden md:inline' style={{ color: "white" }} />
                    <div>
                        <h2 className='text-[#095247] text-[5vw] md:text-[2vw]'>兒童/老年人營養咨詢</h2>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>營養師會透過兒童或老年人的體質和日常飲食習慣進行一個營養評估，為客人設計個人化的日常飲食餐單。</h2>
                        <br />
                        <ul className='list-disc'>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                運動行為正確保養法
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                提升兒童及家長對均衡飲食的認識
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                提供老年人營養諮詢及身體管理服務
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                提供生命期營養需求建議（幼兒/老年）
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                提供一對一個人化健康諮詢服務及營養改善方案
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                教授選購營養食材、學習烹飪技巧，改善孩子的飲食結果
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                提供疾病飲食配搭建議（肥胖、糖尿病、高血壓、心臟病、膽固醇等）
                            </li>
                        </ul>
                        <br />
                        <h2 className='text-[#095247] text-[4vw] md:text-[1.2vw]'>收費 :</h2>
                        <ul className='list-disc'>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                首次營養評估及指導 (45至60分鐘)：$800
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                跟進營養指導 (15至30分鐘)：$480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                持有綜援紙/低收家庭/單親家庭(需有證明) 一律收費480
                            </li>
                            <li className="text-[4vw] md:text-[1.2vw] text-[#095247] ml-6 md:ml-12">
                                (基於身體狀況的改變，營養指導超過六個月或以上，則當首次咨詢)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="inset-0 md:pl-36 md:pr-36 pt-8 pb-24" style={{ backgroundImage: "url(/img/services/sb2.jpg)", backgroundSize: "cover" }}>
                <div className="m-auto md:p-0 md:ml-36 md:mr-36">
                    <h2 className='text-[#6a564b] text-center text-[5vw] md:text-[2vw]'>營養咨詢內容</h2>
                    <br />
                    <h2 className='text-[#a3958c] text-center text-[4vw] md:text-[1.2vw]'>(每項咨詢內容均有不同之處)</h2>
                    <br />
                </div>
                <div className="m-auto md:p-0 ml-4 md:ml-64 md:mr-64">
                    <ul className='list-disc'>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            了解您的現況及健康狀況
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            了解、分析及評估您的飲食及生活習慣
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            按個人需要和喜好，度身訂造營養餐單
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            定期評估營養餐單，按個人健康狀況調整餐單(按次收費)
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            建議烹調技巧及健康食譜
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            教授閱讀及理解營養標籤
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            建議外出飲食的精明選擇
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            教授各種普遍小朋友的營養問題
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            孕婦和胎兒之營養須知與及食物選擇
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            孕婦減少懷孕期間的不適之食物選擇
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            減肥飲食餐單及運動建議，合適補充營養品
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            按個別人士提供個人化營養品及補充品建議
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            綜合體重及體質分析，提供營養飲食等建議
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            評估日常飲食狀況，度身編寫個人營養餐單
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            毒素排除方法及推薦合適營養品和補充劑
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            提供懷孕期，哺乳期及產後進補等飲食指導
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            提供女士預備受孕前及產後的日常飲食方案
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            提供女士預備受孕前及產後的日常飲食方案
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            兒童飲食注意事項及需要的營養素的專業意見
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            老人飲食注意事項及需要的營養素的專業意見
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            健康及營養專題資訊，增進營養及健康等知識
                        </li>
                        <li className="text-[4vw] md:text-[1.2vw] text-[#a3958c] ml-6 md:ml-12">
                            針對個人體質，提供個別有效安全的運動指導
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ServicesPage