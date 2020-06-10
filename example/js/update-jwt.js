function updateJwt(st) {
  document.getElementById('example-form-amount').addEventListener('input', function() {
    st.updateJWT(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhbTAzMTAuYXV0b2FwaSIsImlhdCI6MTU4ODY5NTEzOS41NTgwOTc0LCJwYXlsb2FkIjp7ImJhc2VhbW91bnQiOiIxMDAwIiwiYWNjb3VudHR5cGVkZXNjcmlwdGlvbiI6IkVDT00iLCJjdXJyZW5jeWlzbzNhIjoiR0JQIiwic2l0ZXJlZmVyZW5jZSI6InRlc3RfamFtZXMzODY0MSIsImxvY2FsZSI6ImVuX0dCIiwicGFuIjoiNTIwMDAwMDAwMDAwMTAwNSIsImV4cGlyeWRhdGUiOiIwMS8yMiJ9fQ.wAmn0JqsAfj7ZtsqbDadknWpPhUhJb7CPiQT8VqZ4hk'
    );
  });
}
