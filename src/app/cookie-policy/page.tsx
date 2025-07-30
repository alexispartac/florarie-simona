import { Container, Title, Text, Space } from '@mantine/core';
import { Footer } from '../components/Footer';

export default function CookiePolicy() {
  return (
      <>
          <Container size="md" py="xl" className='mt-20'>
              <Title order={1} mb="xl">Politica de Cookies</Title>

              <Text mb="md">
                  <strong>Ultima actualizare:</strong> {new Date().toLocaleDateString('ro-RO')}
              </Text>

              <Space h="xl" />

              <Title order={2} mb="md">Ce sunt cookies-urile?</Title>
              <Text mb="md">
                  Cookies-urile sunt fișiere mici de text care sunt plasate pe computerul sau dispozitivul mobil atunci când vizitați un site web.
                  Acestea sunt utilizate pe scară largă pentru a face site-urile web să funcționeze sau să funcționeze mai eficient,
                  precum și pentru a furniza informații proprietarilor site-ului.
              </Text>

              <Space h="lg" />

              <Title order={2} mb="md">Cum folosim cookies-urile?</Title>
              <Text mb="md">
                  Utilizăm cookies-urile în următoarele scopuri:
              </Text>

              <Text component="ul" mb="md">
                  <li><strong>Cookies-uri esențiale:</strong> Necesare pentru funcționarea de bază a site-ului (login, coș de cumpărături)</li>
                  <li><strong>Cookies-uri de performanță:</strong> Ne ajută să înțelegem cum vizitatorii interactionează cu site-ul nostru</li>
                  <li><strong>Cookies-uri de funcționalitate:</strong> Permit site-ului să își amintească alegerile făcute (limba, regiunea)</li>
                  <li><strong>Cookies-uri de marketing:</strong> Utilizate pentru a vă livra reclame relevante</li>
              </Text>

              <Space h="lg" />

              <Title order={2} mb="md">Tipurile de cookies pe care le folosim:</Title>

              <Title order={3} size="h4" mb="sm">1. Cookies-uri stricte necesare</Title>
              <Text mb="md">
                  Aceste cookies sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate.
                  Ele includ cookies-urile pentru autentificare, coșul de cumpărături și preferințele de securitate.
              </Text>

              <Title order={3} size="h4" mb="sm">2. Cookies-uri de performanță</Title>
              <Text mb="md">
                  Aceste cookies ne permit să număr vizitatorii și să vedem cum se deplasează prin site-ul nostru.
                  Toate informațiile colectate sunt anonime.
              </Text>

              <Title order={3} size="h4" mb="sm">3. Cookies-uri de funcționalitate</Title>
              <Text mb="md">
                  Aceste cookies permit site-ului să își amintească alegerile pe care le faceți și să ofere funcții îmbunătățite și mai personale.
              </Text>

              <Space h="lg" />

              <Title order={2} mb="md">Cum să controlați cookies-urile?</Title>
              <Text mb="md">
                  Puteți controla și/sau șterge cookies-urile după cum doriți. Puteți șterge toate cookies-urile care sunt deja pe computerul dumneavoastră
                  și puteți seta majoritatea browserelor să împiedice plasarea acestora.
              </Text>

              <Text mb="md">
                  Pentru a afla mai multe despre cum să controlați cookies-urile, vizitați:
              </Text>
              <Text component="ul" mb="md">
                  <li>Google Chrome: Setări → Avansate → Confidențialitate și securitate → Cookies</li>
                  <li>Mozilla Firefox: Opțiuni → Confidențialitate și securitate → Cookies</li>
                  <li>Safari: Preferințe → Confidențialitate → Cookies</li>
                  <li>Microsoft Edge: Setări → Cookies și permisiuni site</li>
              </Text>

              <Space h="lg" />

              <Title order={2} mb="md">Actualizări ale acestei politici</Title>
              <Text mb="md">
                  Ne rezervăm dreptul de a actualiza această politică de cookies. Vă recomandăm să verificați periodic această pagină
                  pentru a fi la curent cu eventualele modificări.
              </Text>

              <Space h="lg" />

              <Title order={2} mb="md">Contact</Title>
              <Text>
                  Dacă aveți întrebări despre această politică de cookies, ne puteți contacta la:
                  <br />
                  <strong>Email:</strong> simonabuzau2@gmail.com
                  <br />
                  <strong>Telefon:</strong> [Numărul de telefon]
              </Text>
          </Container>
          <Footer />
      </>
  );
}
