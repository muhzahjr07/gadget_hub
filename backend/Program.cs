using TheGadgetHub.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddScoped<IDistributorService>(_ => new DistributorService("TechWorld"));
builder.Services.AddScoped<IDistributorService>(_ => new DistributorService("ElectroCom"));
builder.Services.AddScoped<IDistributorService>(_ => new DistributorService("Gadget Central"));
builder.Services.AddScoped<OrchestratorService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDev",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// app.UseHttpsRedirection();

app.UseCors("AllowViteDev");

app.UseAuthorization();

app.MapControllers();

app.Run();
